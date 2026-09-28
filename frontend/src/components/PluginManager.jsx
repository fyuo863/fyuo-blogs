import { useEffect, useRef, useState } from 'react';
import { adminPluginRequest } from '../plugins/pluginApi';
import './plugin-manager.css';

const statusLabels = { published: '已发布', draft: '草稿', disabled: '已下线' };

export default function PluginManager({ token }) {
  const [plugins, setPlugins] = useState([]);
  const [savedOrder, setSavedOrder] = useState([]);
  const [versions, setVersions] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const input = useRef(null);
  const dirty = plugins.map(plugin => plugin.slug).join('|') !== savedOrder.join('|');

  useEffect(() => {
    let alive = true;
    adminPluginRequest(token).then(result => {
      if (!alive) return;
      const items = result.data || [];
      setPlugins(items);
      setSavedOrder(items.map(plugin => plugin.slug));
    }).catch(err => { if (alive) setError(err.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [token, refresh]);

  const reload = () => { setLoading(true); setError(''); setRefresh(value => value + 1); };
  const move = (index, delta) => {
    setPlugins(current => {
      const next = [...current];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });
    setMessage('');
  };
  const perform = async (key, action, success, updateSidebar = false) => {
    setBusy(key); setError(''); setMessage('');
    try {
      await action();
      setMessage(success);
      if (updateSidebar) window.dispatchEvent(new Event('fyuo:plugins-changed'));
      reload();
    } catch (err) { setError(err.message); }
    finally { setBusy(''); }
  };
  const upload = event => {
    event.preventDefault();
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.zip') || file.size > 32 * 1024 * 1024) {
      setError('请选择不超过 32 MiB 的 ZIP 插件包。'); return;
    }
    void perform('upload', async () => {
      const body = new FormData(); body.append('file', file);
      const result = await adminPluginRequest(token, '', { method: 'POST', body });
      setVersions(current => {
        const next = { ...current };
        // Newly uploaded versions are the default selection after reloading.
        for (const plugin of plugins) if (plugin.id === result.data?.plugin_id) next[plugin.slug] = result.data.version;
        return next;
      });
      setFile(null); if (input.current) input.current.value = '';
    }, '上传成功，版本已保存为草稿。选择版本并点击“发布版本”后才会上线。');
  };
  const locked = loading || Boolean(busy);

  return <section className="plugin-manager" aria-label="插件管理" aria-busy={locked}>
    <form className="plugin-manager__upload" onSubmit={upload}>
      <div><h3>上传插件</h3><p>选择 ZIP 包，先存为草稿，再单独发布。最大 32 MiB。</p></div>
      <label className="plugin-manager__file">插件 ZIP
        <input ref={input} type="file" accept=".zip,application/zip" disabled={locked || dirty} onChange={event => { setFile(event.target.files?.[0] || null); setError(''); }} />
      </label>
      <button type="submit" disabled={locked || dirty || !file}>{busy === 'upload' ? '正在上传…' : '上传草稿'}</button>
    </form>
    {error && <p className="plugin-manager__error" role="alert">{error}</p>}
    {message && <p className="plugin-manager__message" role="status">{message}</p>}
    <div className="plugin-manager__toolbar">
      <div><h3>栏目顺序</h3><p>{dirty ? '顺序尚未保存，请保存或还原后再上传、发布。' : '使用上移、下移调整顺序；主站仅显示已发布插件。'}</p></div>
      <div className="plugin-manager__actions">
        <button type="button" disabled={locked} onClick={reload}>{dirty ? '还原顺序' : '刷新列表'}</button>
        <button type="button" disabled={locked || !dirty} onClick={() => perform('order', () => adminPluginRequest(token, '/order', { method: 'PUT', body: JSON.stringify({ slugs: plugins.map(plugin => plugin.slug) }) }), '顺序已保存，侧栏已更新。', true)}>{busy === 'order' ? '正在保存…' : '保存顺序'}</button>
      </div>
    </div>
    {loading ? <p role="status">正在加载插件…</p> : plugins.length === 0 ? <p>还没有插件，上传第一个 ZIP 开始使用。</p> :
      <ol className="plugin-manager__list">
        {plugins.map((plugin, index) => {
          const version = versions[plugin.slug] || plugin.versions?.[0]?.version || plugin.active_version || '';
          const current = plugin.status === 'published' && version === plugin.active_version;
          return <li className="plugin-manager__row" key={plugin.slug}>
            <div className="plugin-manager__summary"><span className="plugin-manager__number">{String(index + 1).padStart(2, '0')}</span>
              <div><h4>{plugin.name}</h4><p>{plugin.slug} · {statusLabels[plugin.status] || plugin.status}</p><p>当前版本：{plugin.active_version || '尚未发布'}</p></div>
            </div>
            <div className="plugin-manager__actions">
              <button type="button" aria-label={`上移 ${plugin.name}`} disabled={locked || index === 0} onClick={() => move(index, -1)}>↑ 上移</button>
              <button type="button" aria-label={`下移 ${plugin.name}`} disabled={locked || index === plugins.length - 1} onClick={() => move(index, 1)}>↓ 下移</button>
            </div>
            <div className="plugin-manager__versions">
              <label>版本<select aria-label={`${plugin.name} 版本`} value={version} disabled={locked || dirty} onChange={event => setVersions(value => ({ ...value, [plugin.slug]: event.target.value }))}>
                {(plugin.versions || []).map(item => <option key={item.version} value={item.version}>{item.version} · {statusLabels[item.status] || item.status}</option>)}
              </select></label>
              <div className="plugin-manager__actions">
                <button type="button" disabled={locked || dirty || !version || current} onClick={() => perform(`publish:${plugin.slug}`, () => adminPluginRequest(token, `/${encodeURIComponent(plugin.slug)}/publish/${encodeURIComponent(version)}`, { method: 'POST' }), `${plugin.name} ${version} 已发布。已打开的页面刷新后使用新版本。`, true)}>{busy === `publish:${plugin.slug}` ? '正在发布…' : current ? '当前版本' : '发布版本'}</button>
                <button type="button" disabled={locked || dirty || plugin.status !== 'published'} onClick={() => perform(`disable:${plugin.slug}`, () => adminPluginRequest(token, `/${encodeURIComponent(plugin.slug)}/disable`, { method: 'POST' }), `${plugin.name} 已下线。`, true)}>下线</button>
              </div>
            </div>
          </li>;
        })}
      </ol>}
  </section>;
}
