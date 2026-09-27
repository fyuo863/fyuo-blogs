export async function listPlugins() {
  const response = await fetch("/api/v1/plugins");
  if (!response.ok) throw new Error("无法加载插件列表");
  const body = await response.json();
  return body.data || [];
}

export async function getPluginManifest(slug) {
  const response = await fetch(`/api/v1/plugins/${encodeURIComponent(slug)}/manifest`);
  if (!response.ok) throw new Error("插件不可用");
  const body = await response.json();
  return body.data;
}
