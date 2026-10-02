import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createHttpApp } from './dist/http.js';

test('MCP validates, binds, revokes, caps and expires sessions', async () => {
  const valid = new Set(['alice', 'bob']);
  const backend = http.createServer((req, res) => { res.writeHead(valid.has(req.headers['x-api-key']) ? 204 : 401); res.end(); });
  await new Promise(r => backend.listen(0, '127.0.0.1', r));
  const instance = createHttpApp({ baseUrl: `http://127.0.0.1:${backend.address().port}`, host:'127.0.0.1', port:0, timeoutMs:1000, mcpPath:'/mcp', defaultStage:'draft' }, { sessions:1, idleMs:1000 });
  const listener = instance.app.listen(0, '127.0.0.1');
  await new Promise(r => listener.once('listening', r));
  const url = `http://127.0.0.1:${listener.address().port}/mcp`;
  async function request(key, id, method='POST') {
    const headers = { Authorization:`Bearer ${key}`, Accept:'application/json, text/event-stream', 'Content-Type':'application/json' };
    if (id) headers['Mcp-Session-Id'] = id;
    const res = await fetch(url, { method, headers, body:method==='POST' ? JSON.stringify({ jsonrpc:'2.0', id:1, method:id ? 'tools/list' : 'initialize', params:id ? {} : { protocolVersion:'2024-11-05', capabilities:{}, clientInfo:{name:'test',version:'1'} } }) : undefined });
    await res.text(); return res;
  }
  try {
    assert.equal((await request('invalid')).status, 401);
    const first = await request('alice'); assert.equal(first.status,200);
    const id = first.headers.get('mcp-session-id'); assert.ok(id);
    for (const method of ['POST','GET','DELETE']) assert.equal((await request('bob',id,method)).status,403);
    assert.equal((await request('alice',id)).status,200);
    assert.equal((await request('bob')).status,429);
    valid.delete('alice'); assert.equal((await request('alice',id)).status,401);
    const second = await request('bob'); assert.equal(second.status,200);
    await new Promise(r=>setTimeout(r,1100));
    assert.equal((await request('bob',second.headers.get('mcp-session-id'))).status,404);
  } finally {
    await instance.close(); listener.closeAllConnections(); backend.closeAllConnections();
    await Promise.all([new Promise(r=>listener.close(r)),new Promise(r=>backend.close(r))]);
  }
});

