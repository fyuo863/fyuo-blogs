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

export async function adminPluginRequest(token, suffix = '', options = {}) {
  const headers = { Authorization: `Bearer ${token}` };
  if (typeof options.body === 'string') headers['Content-Type'] = 'application/json';
  const response = await fetch(`/api/v1/admin/plugins${suffix}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(response.status === 401 ? '登录已失效，请重新登录。' : response.status === 403 ? '需要管理员权限。' : body.error || `请求失败（${response.status}）`);
  return body;
}
