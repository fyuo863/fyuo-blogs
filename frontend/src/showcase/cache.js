import { parseFeatured, parseShowcase } from './catalog.js';
import { resolveReadmeCovers } from './readme.js';

const PREFIX = 'fyuo-showcase-v1:';
const MAX_AGE = 7 * 86400000;
const entries = new Map();
const pending = new Map();
function storage() { try { return globalThis.localStorage; } catch { return null; } }
function safeImage(value) {
  if (!value) return true;
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; }
}
export function refreshInterval(config) { return Math.max(60, Math.min(3600, Number(config.refreshSeconds) || 60)) * 1000; }
function decode(raw, url) {
  if (!raw || !Number.isFinite(raw.savedAt) || raw.savedAt > Date.now() || Date.now() - raw.savedAt > MAX_AGE) return null;
  const albums = parseShowcase(raw.data, url);
  const featured = parseFeatured(raw.data, url);
  const covers = new Map((Array.isArray(raw.covers) ? raw.covers : []).slice(0, 25).filter(item => Array.isArray(item) && /^[\w.-]+\/[\w.-]+$/.test(item[0]) && safeImage(item[1]?.image) && Number.isFinite(item[1]?.expires)));
  const cover = album => ({ ...album, image: album.image || covers.get(album.repository || album.linkUrl.replace(/^https:\/\/github.com\//, '').replace(/\/$/, ''))?.image || '' });
  return { ...raw, albums: albums.map(cover), featured: featured ? cover(featured) : featured, covers };
}
export function readShowcase(url) {
  if (!url) return null;
  const memory = entries.get(url);
  if (memory && Date.now() - memory.savedAt <= MAX_AGE) return memory;
  try {
    const text = storage()?.getItem(PREFIX + url);
    if (!text || text.length > 600 * 1024) return null;
    const entry = decode(JSON.parse(text), url);
    if (entry) entries.set(url, entry);
    return entry;
  } catch { return null; }
}
export function loadShowcase(url, interval, request = fetch) {
  const previous = readShowcase(url);
  if (previous && Date.now() - previous.savedAt < interval) return Promise.resolve(previous);
  if (pending.has(url)) return pending.get(url);
  const operation = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await request(url, { signal: controller.signal, cache: 'no-cache', credentials: 'omit' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      if (text.length > 512 * 1024) throw new Error('展示文件过大');
      const data = JSON.parse(text);
      const albums = parseShowcase(data, url);
      const featured = parseFeatured(data, url);
      const covers = new Map(previous?.covers);
      const resolved = await resolveReadmeCovers([...albums, ...(featured ? [featured] : [])], controller.signal, covers, request);
      const entry = { data, savedAt: Date.now(), covers, albums: resolved.slice(0, albums.length), featured: featured ? resolved.at(-1) : featured };
      entries.set(url, entry);
      // Only public showcase content; never auth, management or user data.
      try {
        const store = storage();
        const keys = Array.from({ length: store?.length || 0 }, (_, i) => store.key(i)).filter(key => key?.startsWith(PREFIX));
        for (const key of keys.filter(key => key !== PREFIX + url).slice(0, Math.max(0, keys.length - 2))) store.removeItem(key);
        store?.setItem(PREFIX + url, JSON.stringify({ data, savedAt: entry.savedAt, covers: [...covers].slice(-25) }));
      } catch { /* Storage disabled or full: the shared memory cache still works. */ }
      return entry;
    } finally { clearTimeout(timeout); }
  })().finally(() => pending.delete(url));
  pending.set(url, operation);
  return operation;
}
