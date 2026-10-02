import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fromExport } from './schema.mjs';

// Configuration is outside the repository; never log credentials or raw source data.
const config = JSON.parse(await readFile(process.argv[2], 'utf8'));
const endpoint = new URL(config.endpoint);
if (endpoint.protocol !== 'https:' && endpoint.hostname !== '127.0.0.1') throw new Error('HTTPS is required');
let lastHash = '';
let lastState = '';
function log(state) { if (state !== lastState) { console.log(new Date().toISOString(), state); lastState = state; } }
async function sync() {
  try {
    if ((await stat(config.exportFile)).size > 32 * 1024 * 1024) throw new Error('Export exceeds 32 MiB');
    const raw = JSON.parse((await readFile(config.exportFile, 'utf8')).replace(/^\uFEFF/, ''));
    const body = JSON.stringify(fromExport(raw, config.timeZone));
    const hash = createHash('sha256').update(body).digest('hex');
    if (hash === lastHash) return;
    const response = await fetch(endpoint, { method: 'PUT', headers: { Authorization: `Bearer ${config.secret}`, 'Content-Type': 'application/json' }, body, redirect: 'error', signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Upload HTTP ${response.status}`);
    lastHash = hash;
    log(`Synced ${raw.generatedAt}`);
  } catch (error) {
    log(error.code === 'ENOENT' ? 'Waiting for Token Monitor auto-export' : `Sync failed (${error.name}); will retry`);
    if (process.argv.includes('--once')) process.exitCode = 1;
  }
}
await sync();
if (!process.argv.includes('--once')) {
  const tick = async () => { await sync(); setTimeout(tick, 30000); };
  setTimeout(tick, 30000);
}
