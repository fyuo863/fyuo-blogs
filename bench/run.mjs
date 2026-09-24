import http from 'node:http';
import os from 'node:os';
import { performance } from 'node:perf_hooks';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
// Deliberately fixed to the isolated compose stack; never accepts a public URL.
const base = 'http://127.0.0.1:18090/api/v1';
export const agent = new http.Agent({ keepAlive: true, maxSockets: 256 });
export function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(sorted.length * p) - 1)] ?? null;
}
export function request(route, method = 'GET', body, token, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(base + route, { method, agent, headers: {
      'Content-Type': 'application/json', ...extraHeaders, ...(token ? { Authorization: `Bearer ${token}` } : {}),
    } }, res => {
      let text = '';
      res.on('data', part => { text += part; });
      res.on('error', reject);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200 && res.statusCode !== 201) { const error=new Error(`HTTP ${res.statusCode}`);error.status=res.statusCode;throw error; }
          resolve(JSON.parse(text));
        } catch (e) { reject(e); }
      });
    });
    const timer = setTimeout(() => req.destroy(new Error('deadline exceeded')), 10000);
    req.on('close', () => clearTimeout(timer));
    req.on('error', reject);
    req.end(body ? JSON.stringify(body) : undefined);
  });
}
async function measure(route, concurrency, duration, validate, method = 'GET', count = null) {
  const samples = [], errors = {};
  let issued = 0, success = 0;
  const start = performance.now(), deadline = start + duration * 1000;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (count === null ? performance.now() < deadline : issued < count) {
      issued++;
      const t = performance.now();
      try { validate(await request(route, method)); success++; }
      catch (e) { errors[e.message] = (errors[e.message] || 0) + 1; }
      samples.push(performance.now() - t);
    }
  }));
  const elapsed = (performance.now() - start) / 1000;
  return { concurrency, requested_duration_s: duration, elapsed_s: elapsed,
    requests: issued, success, errors, error_rate: (issued - success) / issued,
    achieved_rps: issued / elapsed, successful_rps: success / elapsed,
    latency_all_requests_ms: { p50: percentile(samples, .5), p95: percentile(samples, .95), p99: percentile(samples, .99), max: samples.reduce((a, b) => Math.max(a, b), 0) } };
}
async function main() {
  const duration = Number(process.env.BENCH_SECONDS || 10);
  const repeats = Number(process.env.BENCH_REPEATS || 3);
  if (!Number.isInteger(duration) || duration < 1 || duration > 120 || !Number.isInteger(repeats) || repeats < 1 || repeats > 10) throw new Error('Invalid duration/repeats');
  const output = path.join(dir, 'results', new Date().toISOString().replaceAll(':', '-'));
  mkdirSync(output, { recursive: true });
  const report = { started_at: new Date().toISOString(), status: 'running', base,
    environment: { cpu: os.cpus()[0].model, logical_cpus: os.cpus().length, memory_bytes: os.totalmem(), platform: os.platform(), node: process.version },
    methodology: 'Closed-loop, no think time, client/server share host; warmed list cache. Not an uncached comparison or production capacity claim.',
    seed: { articles: 1000, body_bytes: 2048 }, runs: [] };
  const save = () => writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  try {
    report.commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
    report.working_tree = execFileSync('git', ['status', '--short'], { cwd: dir, encoding: 'utf8' }).trim();
    const dockerInfo = JSON.parse(execFileSync('docker', ['info', '--format', '{{json .}}'], { encoding: 'utf8' }));
    report.docker = { cpus: dockerInfo.NCPU, memory_bytes: dockerInfo.MemTotal, version: dockerInfo.ServerVersion };
    const container = JSON.parse(execFileSync('docker', ['inspect', 'fyuo-bench-backend-1'], { encoding: 'utf8' }))[0];
    report.backend = { image_id: container.Image, cpu_limit: container.HostConfig.NanoCpus, memory_limit_bytes: container.HostConfig.Memory };
    const first = await request('/articles');
    if (first.total !== 0) throw new Error('Expected empty isolated database; recreate benchmark stack before rerun');
    const login = await request('/signin', 'POST', { name: 'benchmark', password: 'benchmark-local-only' });
    if (!login.data?.token) throw new Error('No benchmark token');
    let articleId;
    for (let i = 0; i < 1000; i++) {
      const created = await request('/articles', 'POST', { title: `Benchmark ${i}`, content: 'x'.repeat(2048), stage: 'published', tags: ['benchmark'] }, login.data.token);
      articleId = created.data?.id;
      if (!Number.isInteger(articleId)) throw new Error('Invalid seeded article ID');
    }
    const checkList = data => { if (data.total !== 1000 || data.data?.length !== 10) throw new Error('List payload mismatch'); };
    await measure('/articles?page=1&page_size=10', 10, 3, checkList);
    for (let repeat = 1; repeat <= repeats; repeat++) {
      for (const concurrency of (repeat % 2 ? [10, 50, 100, 200] : [200, 100, 50, 10])) {
        const row = await measure('/articles?page=1&page_size=10', concurrency, duration, checkList);
        report.runs.push({ scenario: 'warm-list', repeat, ...row }); save();
        console.log(`list repeat=${repeat} concurrency=${concurrency} successRPS=${row.successful_rps.toFixed(1)} p95=${row.latency_all_requests_ms.p95.toFixed(1)} errors=${row.requests-row.success}`);
      }
    }
    const before = (await request(`/articles/${articleId}`)).data.view_count;
    if (!Number.isInteger(before)) throw new Error('Missing initial view count');
    const counts = await measure(`/articles/${articleId}/view`, 100, 0, data => {
      if (!Number.isInteger(data.view_count)) throw new Error('Invalid counter payload');
    }, 'POST', 10000);
    report.counter = { ...counts, before, verdict: 'inconclusive_final_read_pending' };
    save();
    const after = (await request(`/articles/${articleId}`)).data.view_count;
    report.counter = { ...counts, before, after, observed_delta: after-before,
      expected_delta: counts.success, delta_minus_acknowledged: after-before-counts.success,
      verdict: counts.success !== 10000 ? 'inconclusive_request_errors' : after-before === 10000 ? 'pass' : 'fail',
      scope: 'API-visible Redis counter only; does not verify PostgreSQL persistence or restart durability' };
    report.status = 'completed';
  } catch (e) { report.status = 'failed'; report.failure = e.message; throw e; }
  finally { save(); agent.destroy(); console.log(`Report: ${output}`); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(e => { console.error(e.message); process.exitCode = 1; });
