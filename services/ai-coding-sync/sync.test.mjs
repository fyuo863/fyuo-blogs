import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fromExport, normalize } from './schema.mjs';
import { createServer } from './server.mjs';

const source = () => ({ app: { name: 'token-monitor' }, generatedAt: new Date().toISOString(), snapshot: Object.fromEntries(['today', 'month', 'allTime'].map(k => [k, { totalTokens: 123, clients: { codex: 123 }, models: { model: 123 }, sessions: [{ text: 'PRIVATE' }], projects: { secret: 1 } }])), daily: [{ date: '2026-09-27', tokens: 123, perClient: { private: 1 } }] });
test('export adapter preserves actual totals, strips private fields and rejects corrupt counts', () => {
  const data = fromExport(source());
  assert.equal(data.totals.allTime, 123);
  assert.deepEqual(data.daily, [{ date: '2026-09-27', tokens: 123 }]);
  assert.equal(JSON.stringify(data).includes('PRIVATE'), false);
  assert.equal(JSON.stringify(data).includes('secret'), false);
  const bad = source(); bad.snapshot.today.totalTokens = -1;
  assert.throws(() => fromExport(bad));
  assert.throws(() => normalize({ ...data, daily: [...data.daily, ...data.daily] }));
});
test('ingestion authenticates, persists across restart, rejects old snapshots and limits body size', async t => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'coding-sync-'));
  const secret = 'unit-test-secret-only-not-a-real-key-12345';
  let server;
  t.after(async () => { if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); } await rm(directory, { recursive: true, force: true }); });
  async function start() { server = await createServer({ directory, secret }); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); return `http://127.0.0.1:${server.address().port}/api/v1/showcase/ai-coding`; }
  let url = await start();
  assert.equal((await fetch(url)).status, 404);
  const data = fromExport(source());
  const upload = body => fetch(url, { method: 'PUT', headers: { Authorization: `Bearer ${secret}` }, body: JSON.stringify(body) });
  assert.equal((await fetch(url, { method: 'PUT', body: '{}' })).status, 401);
  assert.equal((await upload({ ...data, extra: 'PRIVATE' })).status, 200);
  assert.deepEqual((await (await fetch(url)).json()).data, data);
  assert.equal((await upload({ ...data, updatedAt: '2020-01-01T00:00:00Z' })).status, 409);
  assert.equal((await upload({ ...data, tools: [{ name: 'bad', tokens: -2 }] })).status, 400);
  assert.equal((await upload({ padding: 'x'.repeat(530000) })).status, 413);
  server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  url = await start();
  assert.deepEqual((await (await fetch(url)).json()).data, data);
});
