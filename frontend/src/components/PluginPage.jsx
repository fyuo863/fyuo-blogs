import { useEffect, useState } from "react";
import { getPluginManifest } from "../plugins/pluginApi";

export default function PluginPage({ slug }) {
  const [manifest, setManifest] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { let live = true; getPluginManifest(slug).then((data) => live && setManifest(data)).catch((e) => live && setError(e.message)); return () => { live = false; }; }, [slug]);
  if (error) return <section className="single-page-reader"><p>{error}</p></section>;
  if (!manifest) return <section className="single-page-reader"><p>正在加载插件…</p></section>;
  const src = `/plugin-assets/${encodeURIComponent(manifest.id)}/${encodeURIComponent(manifest.version)}/${manifest.entry}`;
  return <section className="single-page-reader plugin-page"><iframe title={manifest.name} src={src} sandbox="allow-scripts" style={{ width: "100%", minHeight: "70vh", border: 0 }} /></section>;
}
