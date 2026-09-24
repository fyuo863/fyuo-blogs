// Prepare an isolated old-code comparison/rollback while HTTP is stopped.
import { execFileSync } from 'node:child_process';
const run = (args,input) => execFileSync('docker',['compose','-f','bench/compose.yaml',...args],{input,encoding:'utf8'}).trim();
const state=execFileSync('docker',['inspect','fyuo-bench-backend-1','--format','{{.State.Running}}'],{encoding:'utf8'}).trim();
if(state!=='false')throw new Error('Stop the isolated backend first');
if(Number(run(['exec','-T','redis','redis-cli','XLEN','blog:visits:v2']))!==0)throw new Error('Drain stream before preparing legacy counters');
const rows=JSON.parse(run(['exec','-T','postgres','psql','-U','bench','-d','bench','-At','-c',"SELECT json_agg(x) FROM (SELECT id,view_count,like_count FROM articles ORDER BY id) x"]));
run(['exec','-T','redis','redis-cli','--raw'],rows.flatMap(x=>[`SET article:views:${x.id} ${x.view_count}`,`SET article:likes:${x.id} ${x.like_count}`]).join('\n')+'\n');
console.log(`Prepared ${rows.length} isolated legacy counter snapshots; PostgreSQL unchanged.`);
