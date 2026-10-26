import StudioFrame from './StudioFrame';
import { useEffect, useState } from "react";
import { listPlugins } from "../plugins/pluginApi";
import { Link, Navigate, useLocation } from "react-router-dom";

import "./plugin-shell.css";
import "./studio.css";
import './route-ring.css';
import LiveRingTransition from './LiveRingTransition';
import StudioHome from "../pages/StudioHome";
import Home from "../pages/Home";
import Blog from "../pages/Blog";


import PluginPage from "../components/PluginPage";

function pluginForPath(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path.startsWith("/p/")) {
    try { return decodeURIComponent(path.split("/")[2]); }
    catch { return "missing"; }
  }
  return { "/travel": "travel" }[path] || null;
}

function PlaygroundPlugin({ slug, pageProps }) {
  const [container, setContainer] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!container) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { root: container.closest('.plugin-shell__reader'), rootMargin: '200px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, [container]);
  return <div className="studio-plugin-container" ref={setContainer}>
    {container && ready && <PluginPage slug={slug} {...pageProps} showDrawer={false} portalTarget={container} />}
  </div>;
}

export default function AppLayout({
  user,
  navigationUser = user,
  showSignIn,
  showAdmin,
  onOpenAdmin,
  onCloseAdmin,
  onOpenSignIn,
  onCloseSignIn,
  onLogin,
  onLogout,
  onNotify,
  info,
  setInfo,
}) {
  const location = useLocation();
  const [catalog, setCatalog] = useState({ plugins: [], loading: true, error: '' });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    let request = 0;
    const refresh = () => {
      const current = ++request;
      listPlugins().then(plugins => {
        if (alive && request === current) setCatalog({ plugins, loading: false, error: '' });
      }).catch(error => {
        if (alive && request === current) setCatalog(value => ({ ...value, loading: false, error: error.message }));
      });
    };
    refresh();
    window.addEventListener('fyuo:plugins-changed', refresh);
    return () => { alive = false; window.removeEventListener('fyuo:plugins-changed', refresh); };
  }, [retry]);
  const slug = pluginForPath(location.pathname);

  const drawerItems = user
    ? [
        ...(user.role === "admin"
          ? [{ label: "admin.", onClick: onOpenAdmin }]
          : []),
        { label: "exit.", onClick: onLogout },
      ]
    : [];
  const pageProps = { user, onOpenSignIn, onLogout, onNotify, drawerItems };
  const isDesk = location.pathname.replace(/\/$/, "") === "/desk";
  const path = location.pathname.replace(/\/$/, "") || "/";
  const isHome = path === "/";
  const isBlog = path === "/blog";
  const isCatalog = path === "/plugins";

  return (
    <StudioFrame user={navigationUser} {...{ showSignIn, showAdmin, onOpenAdmin, onCloseAdmin,
      onOpenSignIn, onCloseSignIn, onLogin, onLogout, onNotify, info, setInfo }}>
      <main className="plugin-shell__canvas" id="plugin-canvas">
        <LiveRingTransition location={location}>
        <section key={path} className={`single-page-reader plugin-shell__reader ${isBlog ? 'studio-blog' : ''}`}>
          {isHome ? (user && new URLSearchParams(location.search).get('desk') === 'home' ? <Home {...pageProps} /> : <StudioHome />) :
            isBlog ? <Blog {...pageProps} showDrawer={false} portalTarget={document.getElementById("root")} /> :
            isCatalog ? <div className="studio-catalog"><header className="studio-catalog__heading"><h1>PLAY<br />GROUND</h1><span className="studio-catalog__flash">快闪</span></header>
              {catalog.loading ? <p role="status">正在加载插件…</p> : catalog.error ? <><p role="alert">{catalog.error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>重试</button></> : catalog.plugins.length ? <div className="studio-plugin-gallery">{catalog.plugins.map(plugin => <article className="studio-plugin-card" key={`${plugin.slug}-${plugin.active_version || ''}`} aria-label={plugin.name || plugin.slug}><header className="studio-plugin-card__heading"><h2><Link to={`/p/${encodeURIComponent(plugin.slug)}`}>{plugin.name || plugin.slug}</Link></h2>{plugin.published_at && Number.isFinite(Date.parse(plugin.published_at)) && <time dateTime={plugin.published_at} title={new Date(plugin.published_at).toLocaleString("zh-CN", {timeZone:"Asia/Shanghai",hour12:false})}>上线 {new Intl.DateTimeFormat("zh-CN", {timeZone:"Asia/Shanghai",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(plugin.published_at))}</time>}</header><PlaygroundPlugin slug={plugin.slug} pageProps={pageProps} /></article>)}</div> : <p role="status">暂未发布插件。首页与博客仍然可以正常访问。</p>}
              {user?.role === 'admin' && <button type="button" onClick={onOpenAdmin}>打开插件管理</button>}
            </div> :
            isDesk ? <Navigate to="/blog" replace /> :
            slug ? <PluginPage slug={slug} {...pageProps} showDrawer={false} portalTarget={document.getElementById("root")} /> :
            <div className="plugin-shell__empty">
              {catalog.loading ? <p role="status">正在加载页面列表…</p> : catalog.error ? <><p role="alert">{catalog.error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>重试</button></> : <>
                <h1>{location.pathname === '/' ? '还没有已发布的页面' : '页面不存在'}</h1>
                <p>这个页面尚未就绪。<Link to="/">返回首页</Link>，或<Link to="/plugins">浏览插件</Link>。</p>
              </>}
              {user?.role === 'admin' ? <button type="button" onClick={onOpenAdmin}>打开插件管理</button> : !user && <button type="button" onClick={onOpenSignIn}>管理员登录</button>}
            </div>}
        </section>
        </LiveRingTransition>
      </main>
    </StudioFrame>
  );
}
