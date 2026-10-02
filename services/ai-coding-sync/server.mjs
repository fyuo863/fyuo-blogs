import http from 'node:http';
import { timingSafeEqual, createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalize } from './schema.mjs';

export async function createServer({ directory, secret }) {
  if (!secret || secret.length < 32) throw new Error('A strong upload secret is required');
  await mkdir(directory, { recursive: true });
  const target = path.join(directory, 'snapshot.json');
  let snapshot = null;
  try { snapshot = normalize(JSON.parse(await readFile(target, 'utf8'))); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  let writes = Promise.resolve();
  const hash = value => createHash('sha256').update(value).digest();
  const expected = hash(`Bearer ${secret}`);
  const reply = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(body)); };
  return http.createServer({ requestTimeout: 15000, headersTimeout: 10000, maxHeaderSize: 8192 }, async (req, res) => {
    try {
      if (req.url === '/healthz' && req.method === 'GET') return reply(res, 200, { ok: true });
      if (req.url !== '/api/v1/showcase/ai-coding') return reply(res, 404, { error: 'Not found' });
      if (req.method === 'GET') return reply(res, snapshot ? 200 : 404, snapshot ? { data: snapshot } : { error: 'Awaiting first sync' });
      if (req.method !== 'PUT') return reply(res, 405, { error: 'Method not allowed' });
      if (!timingSafeEqual(hash(req.headers.authorization || ''), expected)) { req.resume(); return reply(res, 401, { error: 'Unauthorized' }); }
      let size = 0; const chunks = [];
      for await (const chunk of req) { size += chunk.length; if (size > 512 * 1024) { reply(res, 413, { error: 'Snapshot too large' }); req.resume(); return; } chunks.push(chunk); }
      let next;
      try { next = normalize(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { return reply(res, 400, { error: 'Invalid snapshot' }); }
      const operation = writes.then(async () => {
        if (snapshot && Date.parse(next.updatedAt) < Date.parse(snapshot.updatedAt)) return 409;
        await writeFile(`${target}.tmp`, JSON.stringify(next), { mode: 0o600 });
        await rename(`${target}.tmp`, target);
        snapshot = next;
        return 200;
      });
      writes = operation.catch(() => {});
      const status = await operation;
      reply(res, status, status === 200 ? { ok: true, updatedAt: next.updatedAt } : { error: 'Older snapshot rejected' });
    } catch { if (!res.headersSent) reply(res, 500, { error: 'Unable to store snapshot' }); }
  });
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const secret = (await readFile(process.env.SYNC_SECRET_FILE || '/run/secrets/upload-token', 'utf8')).trim();
  const server = await createServer({ directory: process.env.SYNC_DATA_DIR || '/data', secret });
  server.listen(Number(process.env.PORT || 18082), '0.0.0.0');
  process.on('SIGTERM', () => server.close());
}
