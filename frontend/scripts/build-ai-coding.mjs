import { build } from 'vite';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { zipSync, unzipSync } from 'fflate';

const frontend = fileURLToPath(new URL('../', import.meta.url));
const id = 'ai-coding';
const version = process.argv[2] || '1.1.1';
if (process.argv.length > 3 || !/^[a-z0-9][a-z0-9._-]{0,79}$/.test(version) || version.includes('..')) {
  throw new Error('Usage: npm run build:ai-coding -- <version>, e.g. 1.0.1');
}
const out = path.join(frontend, 'plugin-dist', id);
await build({
  configFile: path.join(frontend, 'vite.plugins.config.js'),
  build: { outDir: out, lib: { entry: path.join(frontend, 'plugins', id, 'entry.jsx') } },
});
const manifest = {
  id, name: 'AI Coding', version, route: `/p/${id}`,
  entry: 'entry.js', styles: ['style.css'], type: 'module', apiVersion: 1,
  enabled: true, navigation: { label: 'AI Coding', order: 50 }, permissions: [],
};
await writeFile(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const contents = {};
for (const name of (await readdir(out)).sort()) contents[name] = await readFile(path.join(out, name));
// This deliberately small fixture must remain a three-file, root-level package.
if (Object.keys(contents).join(',') !== 'entry.js,manifest.json,style.css') throw new Error('Unexpected test package files');
for (const [name, bytes] of Object.entries(contents)) {
  if (bytes.length > (name === 'manifest.json' ? 64 * 1024 : 8 * 1024 * 1024)) throw new Error(`File too large: ${name}`);
}
const archive = zipSync(Object.fromEntries(Object.entries(contents).map(([name, bytes]) => [name, [bytes, { mtime: new Date('2020-01-01T00:00:00Z') }]])));
for (const [name, bytes] of Object.entries(unzipSync(archive))) {
  if (!Buffer.from(bytes).equals(contents[name])) throw new Error(`ZIP verification failed: ${name}`);
}
await mkdir(path.join(frontend, 'plugin-packages'), { recursive: true });
const zipPath = path.join(frontend, 'plugin-packages', `${id}-${version}.zip`);
await writeFile(zipPath, archive);
console.log(`Built ${id}@${version}\nZIP: ${zipPath}\nSize: ${archive.length} bytes\nNot uploaded or published.`);
