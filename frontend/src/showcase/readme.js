export function readmeImage(markdown, base) {
  const text = markdown.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '');
  const references = new Map([...text.matchAll(/^\s*\[([^\]]+)\]:\s*<?([^\s>]+)>?/gm)].map(m => [m[1].toLowerCase(), m[2]]));
  const images = /!\[([^\]]*)\]\(\s*<?([^\s>]+?)>?(?:\s+["'][^\n]*?["'])?\s*\)|!\[([^\]]*)\]\[([^\]]*)\]|<img\b[^>]*>/gi;
  for (const match of text.matchAll(images)) {
    const value = match[2] || (match[3] !== undefined ? references.get((match[4] || match[3]).toLowerCase()) : /\bsrc\s*=\s*["']([^"']+)["']/i.exec(match[0])?.[1]);
    if (!value || /shields\.io|badgen\.net|badge|\/workflows\/|\/actions\/workflows\//i.test(value)) continue;
    try {
      const url = new URL(value.replaceAll('&amp;', '&'), base);
      if (url.protocol !== 'https:' || url.username || url.password) continue;
      if (url.hostname === 'github.com' && /^\/[^/]+\/[^/]+\/blob\//.test(url.pathname)) {
        url.hostname = 'raw.githubusercontent.com';
        url.pathname = url.pathname.replace('/blob/', '/');
      }
      return url.href;
    } catch { /* Ignore invalid image references. */ }
  }
  return '';
}

export async function resolveReadmeCovers(albums, signal, cache, request = fetch) {
  return Promise.all(albums.map(async album => {
    if (album.image) return album;
    let repository;
    try {
      const url = new URL(album.repository ? `https://github.com/${album.repository}` : album.linkUrl);
      if (url.hostname !== 'github.com') return album;
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length < 2 || !parts.slice(0, 2).every(p => /^[\w.-]+$/.test(p))) return album;
      repository = parts.slice(0, 2).join('/').replace(/\.git$/, '');
    } catch { return album; }
    const previous = cache.get(repository);
    if (previous && previous.expires > Date.now()) return {...album, image:previous.image};
    try {
      const response = await request(`https://api.github.com/repos/${repository}/readme`, {signal, credentials:'omit', headers:{Accept:'application/vnd.github+json'}});
      if (!response.ok) throw new Error('README unavailable');
      const data = await response.json();
      if (data.encoding !== 'base64' || typeof data.content !== 'string' || data.content.length > 1500000 || !data.download_url?.startsWith('https://raw.githubusercontent.com/')) throw new Error('Invalid README');
      const markdown = new TextDecoder().decode(Uint8Array.from(atob(data.content.replace(/\s/g, '')), c => c.charCodeAt(0)));
      const image = readmeImage(markdown, data.download_url);
      cache.set(repository, {image, expires:Date.now() + 600000});
      return {...album, image};
    } catch {
      const image = previous?.image || '';
      cache.set(repository, {image, expires:Date.now() + 60000});
      return {...album, image};
    }
  }));
}
