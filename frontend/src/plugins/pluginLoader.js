import './hostRuntime';

const modules = new Map();
const stylesheets = new Map();
const safePart = /^[a-z0-9][a-z0-9._-]{0,79}$/;
const safeAsset = value => typeof value === 'string' && value.length > 0 && !value.startsWith('/') && !/[\\:?#]/.test(value) && !value.split('/').some(part => !part || part === '..' || part === '.');

export function pluginAssetURL(manifest, asset) {
  if (typeof manifest.id !== 'string' || typeof manifest.version !== 'string' || !safePart.test(manifest.id) || !safePart.test(manifest.version) || !safeAsset(asset)) throw new Error('插件资源路径无效');
  return `/plugin-assets/${manifest.id}/${manifest.version}/${asset.split('/').map(encodeURIComponent).join('/')}`;
}

function loadStylesheet(url) {
  if (!stylesheets.has(url)) {
    stylesheets.set(url, new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = resolve;
      link.onerror = () => { link.remove(); stylesheets.delete(url); reject(new Error('插件样式加载失败')); };
      document.head.appendChild(link);
    }));
  }
  return stylesheets.get(url);
}

export function loadPluginComponent(manifest) {
  if (manifest.type !== 'module' || manifest.apiVersion !== 1) return Promise.reject(new Error('插件与当前站点版本不兼容'));
  const url = pluginAssetURL(manifest, manifest.entry);
  if (!modules.has(url)) {
    const pending = Promise.all([
      import(/* @vite-ignore */ url),
      Promise.all((manifest.styles || []).map(style => loadStylesheet(pluginAssetURL(manifest, style)))),
    ]).then(([module]) => {
      if (typeof module.default !== 'function' && !(module.default && typeof module.default.$$typeof === 'symbol')) throw new Error('插件缺少页面组件');
      return module.default;
    }).catch(error => { modules.delete(url); throw error; });
    modules.set(url, pending);
  }
  return modules.get(url);
}
