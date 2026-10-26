import { useEffect, useRef, useState } from 'react';

const CACHE = 'fyuo-public-covers-v1';
const AGE = 7 * 86400000;
const pending = new Map();
async function coverBlob(url) {
  if (pending.has(url)) return pending.get(url);
  const promise = (async () => {
    let cache;
    try { cache = await globalThis.caches?.open(CACHE); } catch { /* Private mode. */ }
    const saved = await cache?.match(url).catch(() => null);
    if (saved && Date.now() - Number(saved.headers.get('x-fyuo-saved')) < AGE) return saved.blob();
    const response = await fetch(url, { credentials: 'omit', cache: 'force-cache', signal: AbortSignal.timeout(12000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error('Cover unavailable');
    const blob = await response.blob();
    if (blob.size > 8 * 1024 * 1024) throw new Error('Cover too large');
    if (cache) {
      try {
        await cache.put(url, new Response(blob, { headers: { 'content-type': blob.type, 'x-fyuo-saved': String(Date.now()) } }));
        const keys = await cache.keys();
        await Promise.all(keys.slice(0, Math.max(0, keys.length - 48)).map(key => cache.delete(key)));
      } catch { /* Native HTTP caching remains available if storage is full. */ }
    }
    return blob;
  })().finally(() => pending.delete(url));
  pending.set(url, promise);
  return promise;
}

// Each mounted image owns and releases its object URL. Downloads are shared
// between both album rails and reflected faces, and persisted in Cache Storage.
export default function CachedCover({ src, ...props }) {
  const ref = useRef(null);
  const [resolved, setResolved] = useState(null);
  useEffect(() => {
    let active = true, objectURL;
    const load = async () => {
      try {
        const blob = await coverBlob(src);
        if (active) { objectURL = URL.createObjectURL(blob); setResolved({ source: src, url: objectURL }); }
      } catch { if (active) setResolved({ source: src, url: src }); }
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void load(); }
    }, { rootMargin: '200px' });
    observer.observe(ref.current);
    return () => { active = false; observer.disconnect(); if (objectURL) URL.revokeObjectURL(objectURL); };
  }, [src]);
  return <img {...props} ref={ref} src={resolved?.source === src ? resolved.url : undefined} data-cover-source={src} />;
}
