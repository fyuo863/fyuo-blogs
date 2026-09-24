import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const filename = process.argv[2];
if (!filename) throw new Error('Usage: node bench/summarize.mjs <report.json>');
const r = JSON.parse(readFileSync(filename, 'utf8'));
if (!r.runs?.length) throw new Error('No completed list stages');
const lines = ['# Benchmark results', '',
  `Started: ${r.started_at}`, `Status: ${r.status}; failure: ${r.failure || 'none'}`, `Commit: ${r.commit}`,
  `Host CPU: ${r.environment.cpu}; logical CPUs: ${r.environment.logical_cpus}`,
  `Docker: ${r.docker.cpus} CPUs, ${(r.docker.memory_bytes / 2**30).toFixed(2)} GiB`,
  `Backend image: ${r.backend.image_id}`, '',
  `${r.seed.articles} articles, ${r.seed.body_bytes}-byte bodies; warmed first page (10 articles); ${r.runs[0].requested_duration_s} seconds per stage; ${new Set(r.runs.map(x=>x.repeat)).size} repetitions.`,
  'Closed-loop clients and server share the host. No Nginx/TLS. Values below are ranges across repetitions, not merged percentiles.', '',
  '| Concurrency | Successful RPS range | P95 ms range | P99 ms range | Errors / requests |',
  '| --- | --- | --- | --- | --- |'];
for (const c of [10, 50, 100, 200]) {
  const rows = r.runs.filter(x => x.concurrency === c);
  const range = fn => { const a = rows.map(fn); return `${Math.min(...a).toFixed(1)} - ${Math.max(...a).toFixed(1)}`; };
  lines.push(`| ${c} | ${range(x=>x.successful_rps)} | ${range(x=>x.latency_all_requests_ms.p95)} | ${range(x=>x.latency_all_requests_ms.p99)} | ${rows.reduce((s,x)=>s+x.requests-x.success,0)} / ${rows.reduce((s,x)=>s+x.requests,0)} |`);
}
if (r.counter?.observed_delta !== undefined) lines.push('', '## Counter', '',
  `Concurrency: ${r.counter.concurrency}; successful requests: ${r.counter.success}/${r.counter.requests}; observed delta: ${r.counter.observed_delta}; verdict: ${r.counter.verdict}.`,
  `Successful RPS: ${r.counter.successful_rps.toFixed(1)}; P95: ${r.counter.latency_all_requests_ms.p95.toFixed(1)} ms.`,
  r.counter.scope, '',
  'These are short local baseline measurements, not production capacity or cache speedup evidence.');
else lines.push('', '## Counter', '', 'Incomplete: final API read failed. No counter accuracy claim is supported.',
  'Backend logs show HTTP 500 and PostgreSQL connection failures: cannot assign requested address.',
  'The original runner did not checkpoint counter request statistics before the final read. Exact counter success rate is unavailable in this report.',
  '', 'Short local measurements only; not production capacity or cache speedup evidence.');
const output = path.join(path.dirname(filename), 'summary.md');
writeFileSync(output, lines.join('\n') + '\n');
console.log(lines.join('\n'));
