import { request, agent, percentile } from './run.mjs';
import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
import { randomUUID } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import os from 'node:os';

const compose=['compose','-f','bench/compose.yaml'];
const docker=async args=>(await promisify(execFile)('docker',[...compose,...args],{maxBuffer:8*1024*1024})).stdout.trim();
const redis=(...args)=>docker(['exec','-T','redis','redis-cli','--raw',...args]);
const sql=async query=>JSON.parse(await docker(['exec','-T','postgres','psql','-U','bench','-d','bench','-At','-c',query]));
const snapshot=()=>sql("SELECT json_build_object('events',(SELECT count(*) FROM visit_events),'views',(SELECT sum(view_count) FROM articles),'records',(SELECT count(*) FROM visit_records))");
const out='bench/results/resilience-'+new Date().toISOString().replaceAll(':','-');mkdirSync(out,{recursive:true});
const report={status:'running',started_at:new Date().toISOString(),environment:{cpu:os.cpus()[0].model,cpus:os.cpus().length,memory:os.totalmem(),node:process.version},stages:[]};
const save=()=>writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
let ids=[],accepted=new Set(),duplicates=0,peak=0;
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function drain(){const t=performance.now();for(;;){const n=Number(await redis('XLEN','blog:visits:v2'));peak=Math.max(peak,n);if(!n)return performance.now()-t;if(performance.now()-t>120000)throw new Error('Drain timeout');await pause(500)}}
async function stage(name,count,concurrency,fn){
 const samples=[],errors={};let sequence=0,success=0;const start=performance.now();
 await Promise.all(Array.from({length:concurrency},async()=>{while(sequence<count){const i=sequence++,t=performance.now();try{await fn(i);success++}catch(e){errors[e.message]=(errors[e.message]||0)+1}samples.push(performance.now()-t)}}));
 const elapsed=(performance.now()-start)/1000;
 const row={name,count,concurrency,success,errors,elapsed_s:elapsed,rps:success/elapsed,error_rate:(count-success)/count,p50:percentile(samples,.5),p95:percentile(samples,.95),p99:percentile(samples,.99)};
 report.stages.push(row);save();console.log(JSON.stringify(row));return row;
}
async function send(eventId,id){const receipt=await request(`/articles/${id}/view`,'POST',null,null,{'X-Event-Id':eventId,'X-Visitor-Id':'resilience'});if(!receipt.accepted)throw new Error('Not accepted');if(receipt.duplicate)duplicates++;accepted.add(eventId);return receipt}
const eventId=()=>`${Date.now()}-${randomUUID().replaceAll('-','')}`;
try{
 report.git=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
 report.image=(await promisify(execFile)('docker',['inspect','fyuo-bench-backend-1','--format','{{.Image}}'])).stdout.trim();
 const info=JSON.parse((await promisify(execFile)('docker',['info','--format','{{json .}}'])).stdout);report.docker={cpus:info.NCPU,memory:info.MemTotal,version:info.ServerVersion};
 const list=await request('/articles?page=1&page_size=10');if(list.total!==1000||list.data.some(x=>!x.title.startsWith('Benchmark ')))throw new Error('Expected isolated synthetic dataset');ids=list.data.map(x=>x.id);
 await drain();report.before=await snapshot();
 for(let round=1;round<=3;round++){
  await stage(`hot-list-${round}`,5000,100,()=>request('/articles?page=1&page_size=10'));
  await redis('SET','blog:v2:epoch',randomUUID());
  await stage(`cold-detail-wave-${round}`,200,200,()=>request(`/articles/${ids[0]}`));
 }
 for (const id of ids) await request(`/articles/${id}`);
 let sampling=true;
 const sampler=(async()=>{while(sampling){try{peak=Math.max(peak,Number(await redis('XLEN','blog:visits:v2')))}catch{}await pause(250)}})();
 try{await stage('burst',3000,200,i=>send(eventId(),ids[i%ids.length]));report.burst_drain_ms=await drain()}finally{sampling=false;await sampler}
 const retry=eventId();await send(retry,ids[0]);await stage('same-event-retries',100,100,()=>send(retry,ids[0]));await drain();
 // Warm all article validity entries immediately before taking PostgreSQL down.
 for (const id of ids) await request(`/articles/${id}`);
 await docker(['stop','postgres']);
 try{
  await stage('postgres-down-reads',100,20,i=>request(`/articles/${ids[i%ids.length]}`));
  await stage('postgres-down-accepted-events',500,50,i=>send(eventId(),ids[i%ids.length]));
  report.outage_backlog=Number(await redis('XLEN','blog:visits:v2'));peak=Math.max(peak,report.outage_backlog);
 }finally{await docker(['start','postgres'])}
 report.recovery_drain_ms=await drain();
 await docker(['stop','redis']);
 try{
  const reads=await stage('redis-down-bounded-reads',32,32,i=>request(`/articles/${ids[i%ids.length]}`));
  if(reads.success===0)throw new Error('Redis outage exhausted all SQL fallback reads');
  const row=await stage('redis-down-statistics-rejected',8,8,i=>send(eventId(),ids[i%ids.length]));
  if(row.success)throw new Error('Statistics falsely accepted without Redis');
 }finally{await docker(['start','redis'])}
 await pause(2000);
 await stage('redis-recovered-initial-wave',100,20,i=>send(eventId(),ids[i%ids.length]));
 await pause(1000);
 const recovered=await stage('redis-recovered-after-calibration',100,20,i=>send(eventId(),ids[i%ids.length]));
 if(recovered.success!==100)throw new Error('Recovery did not stabilize');
 await drain();
 report.after=await snapshot();report.accepted_unique=accepted.size;report.duplicate_responses=duplicates;report.backlog_peak_sampled=peak;
 report.persisted=report.after.events-report.before.events;report.database_delta=report.after.views-report.before.views;report.difference=report.database_delta-accepted.size;
 report.status=report.difference===0&&report.persisted===accepted.size?'passed':'failed';if(report.status!=='passed')process.exitCode=1;
}catch(e){report.status='failed';report.error=e.stack;process.exitCode=1}
finally{save();agent.destroy();console.log(`Report: ${out}`)}
