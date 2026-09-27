import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { listPlugins } from "../plugins/pluginApi";

const corePlugins = ["index", "journal", "travel"].map(slug => ({ slug, name: slug }));

export default function PluginSidebar({ activeSlug, user, onOpenSignIn, onOpenAdmin, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [plugins, setPlugins] = useState([]);
  const rail = useRef(null);
  useEffect(() => {
    const dismiss = event => { if (!rail.current?.contains(event.target)) setCollapsed(true); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  useEffect(() => {
    let alive = true;
    listPlugins().then(items => { if (alive) setPlugins(items); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const entries = [...corePlugins, ...plugins.filter(plugin => !corePlugins.some(core => core.slug === plugin.slug))];

  return <aside ref={rail} className="plugin-sidebar" data-collapsed={collapsed} aria-label="站点侧栏"
    onPointerEnter={event => { if (event.pointerType === "mouse") setCollapsed(false); }}
    onPointerLeave={event => { if (event.pointerType === "mouse") setCollapsed(true); }}
    onKeyDown={event => { if (event.key === "Escape") { setCollapsed(true); rail.current?.querySelector('[aria-current="page"]')?.focus(); } }}>
    <div className="plugin-sidebar__body" id="plugin-sidebar-body">
      <nav className="plugin-sidebar__tabs" aria-label="插件导航">
        {entries.map(plugin => <div key={plugin.slug} className="plugin-sidebar__tab" data-active={activeSlug === plugin.slug}>
          <div className="plugin-sidebar__preview" aria-hidden="true" inert="">
            <iframe title={`${plugin.name || plugin.slug} 实时预览`} tabIndex={-1} src={`/p/${encodeURIComponent(plugin.slug)}?__plugin_preview=1`} />
          </div>
          <Link className="plugin-sidebar__select" to={`/p/${encodeURIComponent(plugin.slug)}`} aria-label={plugin.name || plugin.slug} aria-current={activeSlug === plugin.slug ? "page" : undefined}
            onClick={event => { if (collapsed) { if (event.nativeEvent.pointerType !== "mouse") event.preventDefault(); setCollapsed(false); } }} />
        </div>)}
      </nav>
      <div className="plugin-sidebar__bottom" inert={collapsed ? "" : undefined} aria-hidden={collapsed}>
        {user ? <div className="plugin-sidebar__account">
          <Link to="/desk">desk.</Link>
          {user.role === "admin" && <button type="button" onClick={onOpenAdmin}>管理后台</button>}
          <button type="button" onClick={onLogout}>退出登录</button>
        </div> : <button className="plugin-sidebar__login" type="button" onClick={onOpenSignIn}>log-in.</button>}
        <a className="plugin-sidebar__icp" href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">浙ICP备2026038123号</a>
      </div>
    </div>
  </aside>;
}
