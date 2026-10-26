import { Component, useEffect, useState } from "react";
import { getPluginManifest } from "../plugins/pluginApi";
import { loadPluginComponent, pluginAssetURL } from "../plugins/pluginLoader";
import { isAdminOrigin, PUBLIC_ORIGIN } from '../services/origins';

class PluginBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p role="alert">页面加载失败，请刷新后重试。</p> : this.props.children;
  }
}

function PluginContent({ slug, ...props }) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    let live = true;
    getPluginManifest(slug).then(async manifest => {
      if (manifest.id !== slug) throw new Error('插件标识不匹配');
      if (manifest.type === 'module') return { Page: await loadPluginComponent(manifest) };
      if (manifest.type !== 'iframe') throw new Error('不支持的插件类型');
      return { manifest, src: pluginAssetURL(manifest, manifest.entry) };
    }).then(data => { if (live) setResult(data); }).catch(error => { if (live) setResult({ error: error.message }); });
    return () => { live = false; };
  }, [slug]);
  if (!result) return <p role="status">正在加载插件…</p>;
  if (result.error) return <p role="alert">{result.error}</p>;
  if (result.Page) return <result.Page {...props} />;
  return <iframe title={result.manifest.name} src={result.src} sandbox="allow-scripts" style={{ width: '100%', minHeight: '70vh', border: 0 }} />;
}

export default function PluginPage({ slug, ...props }) {
  // The www shell shares the public routes, but uploaded code still runs only
  // on the unprivileged public origin, never beside the management session.
  if (isAdminOrigin) {
    const url = new URL(`${PUBLIC_ORIGIN}/p/${encodeURIComponent(slug)}${window.location.search}${window.location.hash}`);
    url.searchParams.set('__plugin_embed', '1');
    url.searchParams.delete('__plugin_preview');
    return <iframe className="public-plugin-frame" title={`插件 ${slug}`} src={url.href} sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" allow="microphone; display-capture" />;
  }
  return <PluginBoundary key={slug}><PluginContent slug={slug} {...props} /></PluginBoundary>;
}
