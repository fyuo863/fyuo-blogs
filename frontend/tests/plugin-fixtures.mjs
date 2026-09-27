import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../backend/builtin-plugins/', import.meta.url));
export async function servePlugins(page) {
  const manifests = Object.fromEntries(await Promise.all(['index', 'journal', 'travel'].map(async id => [id, JSON.parse(await readFile(path.join(root, id, 'manifest.json'), 'utf8'))])));
  await page.route('**/api/v1/plugins/*/manifest', route => {
    const id = new URL(route.request().url()).pathname.split('/')[4];
    return manifests[id] ? route.fulfill({ json: { data: manifests[id] } }) : route.fulfill({ status: 404, json: { error: '插件不可用' } });
  });
  await page.route('**/plugin-assets/**', async route => {
    const [, , id, version, ...parts] = new URL(route.request().url()).pathname.split('/');
    if (!manifests[id] || manifests[id].version !== version || parts.some(part => part === '..')) return route.fulfill({ status: 404 });
    const mime = { '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
    try {
      const body = await readFile(path.join(root, id, ...parts));
      return route.fulfill({ body, contentType: mime[path.extname(parts.at(-1))] || 'application/octet-stream' });
    } catch { return route.fulfill({ status: 404 }); }
  });
  return manifests;
}

export const user = { id: 1, name: 'migration-test', role: 'admin', token: 'local-fixture-token' };
export const article = { id: 42, title: 'Migration fixture', content: '# Preserved Markdown\n\n**Original formatting** and a [link](https://example.com).', stage: 'published', vol: 1, tags: ['test'], created_at: '2026-09-01T00:00:00Z', view_count: 7, like_count: 2 };
export async function mockBusinessAPI(page, { signedIn = false } = {}) {
  const calls = [];
  if (signedIn) await page.addInitScript(profile => localStorage.setItem('user', JSON.stringify(profile)), user);
  await page.route('**/api/v1/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    calls.push({ method: request.method(), path: url.pathname, body: request.postData(), headers: request.headers() });
    let data = [];
    if (url.pathname.includes('/home-content')) data = null;
    if (url.pathname.endsWith('/signin')) data = user;
    if (/\/articles(?:\/search)?$/.test(url.pathname)) data = request.method() === 'GET' ? [article] : { ...article, ...request.postDataJSON() };
    if (url.pathname.endsWith('/articles/42')) data = request.method() === 'PUT' ? { ...article, ...request.postDataJSON() } : article;
    if (url.pathname.endsWith('/travel-places') && request.method() === 'POST') data = { ...request.postDataJSON(), id: 5 };
    if (url.pathname.endsWith('/travel-places/5') && request.method() === 'PUT') data = { ...request.postDataJSON(), id: 5 };
    if (url.pathname.endsWith('/view')) return route.fulfill({ json: { view_count: 8, like_count: 2 } });
    if (url.pathname.endsWith('/like')) return route.fulfill({ json: { liked: true, like_count: 3 } });
    if (url.pathname.endsWith('/uploads/images')) data = { url: '/uploads/migration-test.png' };
    await route.fulfill({ json: { data } });
  });
  await servePlugins(page);
  await page.route('https://gibs.earthdata.nasa.gov/**', route => route.abort());
  return calls;
}
