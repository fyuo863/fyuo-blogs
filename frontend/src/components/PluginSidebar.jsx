import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";


export default function PluginSidebar({ plugins, activeSlug, user, onOpenSignIn, onOpenAdmin, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const rail = useRef(null);
  useEffect(() => {
    const dismiss = event => { if (!rail.current?.contains(event.target)) setCollapsed(true); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  const entries = plugins;
  const isCollapsed = plugins.length > 0 && collapsed;

  return <aside ref={rail} className="plugin-sidebar" data-collapsed={isCollapsed} aria-label="站点侧栏"
    onPointerEnter={event => { if (event.pointerType === "mouse") setCollapsed(false); }}
    onPointerLeave={event => { if (event.pointerType === "mouse") setCollapsed(true); }}
    onKeyDown={event => { if (event.key === "Escape") { setCollapsed(true); rail.current?.querySelector('[aria-current="page"]')?.focus(); } }}>
    <div className="plugin-sidebar__body" id="plugin-sidebar-body">
      <nav className="plugin-sidebar__tabs" aria-label="插件导航">
        {entries.map(plugin => <div key={plugin.slug} className="plugin-sidebar__tab" data-active={activeSlug === plugin.slug}>
          <div className="plugin-sidebar__preview" aria-hidden="true" inert="">
            <iframe key={plugin.active_version || plugin.slug} title={`${plugin.name || plugin.slug} 实时预览`} tabIndex={-1} src={`/p/${encodeURIComponent(plugin.slug)}?__plugin_preview=1`} />
          </div>
          <Link className="plugin-sidebar__select" to={`/p/${encodeURIComponent(plugin.slug)}`} aria-label={plugin.name || plugin.slug} aria-current={activeSlug === plugin.slug ? "page" : undefined}
            onClick={() => setCollapsed(false)} />
        </div>)}
      </nav>
      <div className="plugin-sidebar__bottom" inert={isCollapsed ? "" : undefined} aria-hidden={isCollapsed}>
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
