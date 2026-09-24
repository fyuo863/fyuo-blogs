import { request, agent, percentile } from './run.mjs';
import { performance } from 'node:perf_hooks';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, 'results', 'visitor-' + new Date().toISOString().replaceAll(':', '-'));
mkdirSync(out, { recursive: true });
const report = { started_at: new Date().toISOString(), status: 'running', runs: [],
  method: 'Closed-loop list -> detail -> view; no think time; deterministic rotation over first-page articles. Shared host, no browser rendering/static assets/Nginx/TLS. No retries. Existing isolated synthetic dataset.',
  environment: { cpu: os.cpus()[0].model, cpus: os.cpus().length, memory: os.totalmem(), node: process.version } };
const save = () => writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
const stats = a => ({ n: a.length, p50: percentile(a, .5), p95: percentile(a, .95), p99: percentile(a, .99) });
const docker = args => execFileSync('docker', args, { encoding: 'utf8', maxBuffer: 4*1024*1024 });
async function snapshot(ids) {
  const counts = {}, errors = {};
  for (const id of ids) {
    try {
      const data = (await request(`/articles/${id}`)).data;
      if (!Number.isInteger(data?.view_count)) throw new Error('Invalid count');
      counts[id] = data.view_count;
    } catch (e) { errors[id] = e.message; }
  }
  return { counts, errors };
}
function durableSnapshot() {
  return JSON.parse(docker(['compose','-f',path.join(dir,'compose.yaml'),'exec','-T','postgres','psql','-U','bench','-d','bench','-At','-c',"SELECT json_build_object('events',(SELECT count(*) FROM visit_events),'views',(SELECT sum(view_count) FROM articles),'records',(SELECT count(*) FROM visit_records))"]).trim());
}
async function main() {
  try {
    report.git = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
    const info = JSON.parse(docker(['info', '--format', '{{json .}}']));
    report.docker = { cpus: info.NCPU, memory: info.MemTotal, version: info.ServerVersion };
    const container = JSON.parse(docker(['inspect', 'fyuo-bench-backend-1']))[0];
    report.image = container.Image;
    const list = await request('/articles?page=1&page_size=10');
    if (list.total !== 1000 || list.data?.length !== 10 || list.data.some(x=>!x.title?.startsWith('Benchmark '))) throw new Error('Expected isolated 1000-article synthetic dataset from run.mjs');
    const ids = list.data.map(x=>x.id);
    report.article_ids = ids;
    report.before = await snapshot(ids);
    if (process.env.VISITOR_STREAM === '1') report.durable_before = durableSnapshot();
    if (Object.keys(report.before.errors).length) throw new Error('Baseline counts unavailable');
    const acknowledged = Object.fromEntries(ids.map(id=>[id,0]));
    const attempted = Object.fromEntries(ids.map(id=>[id,0]));
    report.acknowledged = acknowledged;
    report.attempted = attempted;
    save();
    let sequence = 0;
    for (let repeat=1; repeat<=3; repeat++) {
      for (const concurrency of repeat%2 ? [10,50,100,200] : [200,100,50,10]) {
        const timings = {list:[],detail:[],view:[]}, errors = {}, success = {list:0,detail:0,view:0};
        const flowTimes = [];
        let flows=0, completed=0;
        const start=performance.now(), deadline=start+10000;
        await Promise.all(Array.from({length:concurrency}, async()=>{
          while (performance.now()<deadline) {
            const id=ids[sequence++%ids.length], t=performance.now();
            flows++;
            let stage='list';
            try {
              for (stage of ['list','detail','view']) {
                const begin=performance.now();
                try {
                  if (stage==='view') attempted[id]++;
                  const data=await request(stage==='list' ? '/articles?page=1&page_size=10' : `/articles/${id}${stage==='view'?'/view':''}`, stage==='view'?'POST':'GET');
                  if (stage==='list' && (data.total!==1000 || data.data?.length!==10)) throw new Error('Invalid list');
                  if (stage==='detail' && (data.data?.id!==id || typeof data.data?.content!=='string')) throw new Error('Invalid article');
                  if (stage==='view' && !Number.isInteger(data.view_count)) throw new Error('Invalid count');
                  success[stage]++;
                  if (stage==='view') acknowledged[id]++;
                } finally { timings[stage].push(performance.now()-begin); }
              }
              completed++;
              flowTimes.push(performance.now()-t);
            } catch(e) { const key=stage+': '+e.message; errors[key]=(errors[key]||0)+1; }
          }
        }));
        const elapsed=(performance.now()-start)/1000;
        const row={repeat, concurrency, elapsed_s:elapsed, started:flows, completed,
          completed_flows_per_second:completed/elapsed, failed_fraction:(flows-completed)/flows,
          successful_flow_ms:stats(flowTimes), stages:Object.fromEntries(Object.keys(timings).map(k=>[k,{success:success[k],...stats(timings[k])}])),errors};
        report.runs.push(row); save();
        console.log(JSON.stringify({repeat,concurrency,flows_per_s:row.completed_flows_per_second,failures:flows-completed,detail_p95:row.stages.detail.p95}));
        if (row.failed_fraction>0.05) { report.stop_reason='More than 5% flows failed; higher/repeated load skipped'; break; }
      }
      if (report.stop_reason) break;
    }
    if (process.env.VISITOR_STREAM === '1') {
      const began=performance.now();
      let backlog;
      do {
        backlog=Number(docker(['compose','-f',path.join(dir,'compose.yaml'),'exec','-T','redis','redis-cli','XLEN','blog:visits:v2']).trim());
        if (!backlog) break;
        if (performance.now()-began>120000) throw new Error('Queue failed to drain');
        await new Promise(r=>setTimeout(r,500));
      } while(backlog);
      report.drain_ms=performance.now()-began;
      report.durable_after=durableSnapshot();
      const accepted=Object.values(acknowledged).reduce((a,b)=>a+b,0);
      report.durability={accepted,persisted:report.durable_after.events-report.durable_before.events,
        database_delta:report.durable_after.views-report.durable_before.views,
        difference:report.durable_after.views-report.durable_before.views-accepted};
    }
    report.after=await snapshot(ids);
    report.counter=ids.map(id=>({ id, acknowledged:acknowledged[id], attempted:attempted[id],
      delta:report.after.counts[id]===undefined?null:report.after.counts[id]-report.before.counts[id],
      verdict:report.after.counts[id]===undefined||attempted[id]!==acknowledged[id]?'inconclusive':report.after.counts[id]-report.before.counts[id]===acknowledged[id]?'pass':'fail' }));
    report.status=report.stop_reason?'stopped_on_errors':'completed';
  } catch(e) { report.status='failed';report.error=e.message;process.exitCode=1; }
  finally {
    save();agent.destroy();
    try { writeFileSync(path.join(out,'backend-tail.log'),docker(['compose','-f',path.join(dir,'compose.yaml'),'logs','--no-color','--tail','200','backend'])); } catch {}
    const lines=['# Visitor benchmark', '',`Status: ${report.status}`,report.stop_reason||report.error||'',
      report.method,'','| Concurrency | Round | Complete flows/s | Failed flows | Detail P95 ms | View P95 ms |','|---|---|---|---|---|---|'];
    for (const r of report.runs) lines.push(`|${r.concurrency}|${r.repeat}|${r.completed_flows_per_second.toFixed(1)}|${r.started-r.completed}/${r.started}|${r.stages.detail.p95?.toFixed(1)}|${r.stages.view.p95?.toFixed(1)}|`);
    lines.push('', 'Counter verification (API-visible values only):', JSON.stringify(report.counter||null,null,2));
    writeFileSync(path.join(out,'summary.md'),lines.join('\n'));
    console.log('Report: '+out);
  }
}
await main();
