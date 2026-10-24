export function showcaseURL(config) {
  if (!config.repository) return null;
  if (!/^[\w.-]+\/[\w.-]+$/.test(config.repository) || config.repository.includes('..')) throw new Error('展示仓库应为 owner/repository');
  if (!/^[\w.-]+$/.test(config.branch) || config.branch.includes('..')) throw new Error('无效分支');
  const parts = config.path.split('/');
  if (!parts.length || parts.some(x=>!x || x==='.' || x==='..' || !/^[\w.-]+$/.test(x))) throw new Error('无效展示文件路径');
  return `https://raw.githubusercontent.com/${config.repository}/${encodeURIComponent(config.branch)}/${parts.map(encodeURIComponent).join('/')}`;
}
function safeURL(value, base, optional = false) {
  if (optional && !value) return '';
  if (typeof value !== 'string' || !value.trim()) throw new Error('缺少资源地址');
  const url = new URL(value, base);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('仅支持无凭据的 HTTPS 地址');
  return url.href;
}
export function parseShowcase(input, sourceURL) {
  if (input?.version !== 1 || !Array.isArray(input.albums) || input.albums.length > 24) throw new Error('展示文件格式无效');
  const ids = new Set();
  return input.albums.map(album => {
    if (!album || typeof album.id !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9-]{0,79}$/.test(album.id) || ids.has(album.id)) throw new Error('专辑 id 必须唯一');
    ids.add(album.id);
    if (typeof album.title !== 'string' || !album.title.trim() || album.title.length > 160) throw new Error('专辑标题无效');
    for (const key of ['description','content']) if (album[key] !== undefined && (typeof album[key] !== 'string' || album[key].length > 20000)) throw new Error('专辑内容无效');
    const repository = album.repository || '';
    if (typeof repository !== 'string' || (repository && (!/^[\w.-]+\/[\w.-]+$/.test(repository) || repository.includes('..')))) throw new Error('无效项目仓库');
    return {repository,contentBase:sourceURL,id:album.id,title:album.title.trim(),image:safeURL(album.cover,sourceURL,true),description:album.description || '',content:album.content || '',linkUrl:safeURL(album.url,sourceURL,true)};
  });
}

export function parseFeatured(input, sourceURL) {
  if (input.featured === undefined || input.featured === null) return input.featured;
  if (typeof input.featured !== 'object' || Array.isArray(input.featured)) throw new Error('推荐项目格式无效');
  return parseShowcase({version:1, albums:[{...input.featured, id:'featured'}]}, sourceURL)[0];
}
