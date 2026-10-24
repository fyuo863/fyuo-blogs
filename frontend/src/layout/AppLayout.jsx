import { useEffect, useRef, useState } from "react";
import { listPlugins } from "../plugins/pluginApi";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";

import "./plugin-shell.css";
import "./studio.css";
import StudioHome from "../pages/StudioHome";
import Home from "../pages/Home";
import Blog from "../pages/Blog";

import SignInModal from "../components/SignInModal";
import InfoModal from "../components/InfoModal";
import AdminPanel from "../components/AdminPanel";

import ContentDesk from "../pages/ContentDesk";
import PluginPage from "../components/PluginPage";
import GithubIcon from "../module/GithubIcon";
import { UserRound, Settings, LogOut } from 'lucide-react';

function pluginForPath(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path.startsWith("/p/")) {
    try { return decodeURIComponent(path.split("/")[2]); }
    catch { return "missing"; }
  }
  return { "/travel": "travel" }[path] || null;
}

export default function AppLayout({
  user,
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
  const readerRef = useRef(null);
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
  useEffect(() => { readerRef.current?.scrollTo({ top: 0 }); }, [location.pathname]);

  return (
    <div className="plugin-shell studio-shell">
      <header className="studio-nav">
        <Link className="studio-wordmark" to="/" aria-label="FYUO 首页">FYUO<span>®</span></Link>
        <nav aria-label="主导航">
          <NavLink to="/" end>HOME<span>首页</span></NavLink>
          <NavLink to="/blog">JOURNAL<span>博客</span></NavLink>
          <NavLink to="/plugins">PLAYGROUND<span>插件</span></NavLink>
        </nav>
        <div className="studio-nav__actions">
          <a href="https://github.com/fyuo863" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><GithubIcon size={19} /></a>
          <button type="button" aria-label={user ? '管理后台' : 'log-in.'} title={user ? '管理后台' : '登录'} onClick={user?.role === 'admin' ? onOpenAdmin : onOpenSignIn}>{user ? <Settings size={19} /> : <UserRound size={19} />}</button>
          {user && <button type="button" aria-label="退出" title="退出" onClick={onLogout}><LogOut size={19} /></button>}
        </div>
      </header>
      <main className="plugin-shell__canvas" id="plugin-canvas">
        <section ref={readerRef} key={path} className={`single-page-reader plugin-shell__reader ${isBlog ? 'studio-blog' : ''}`}>
          {isHome ? (user && new URLSearchParams(location.search).get('desk') === 'home' ? <Home {...pageProps} /> : <StudioHome />) :
            isBlog ? <Blog {...pageProps} showDrawer={Boolean(user)} portalTarget={document.getElementById("root")} /> :
            isCatalog ? <div className="studio-catalog"><h1>PLAY<br />GROUND</h1><p>一些想法，打开就能玩。</p>
              {catalog.loading ? <p role="status">正在加载插件…</p> : catalog.error ? <><p role="alert">{catalog.error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>重试</button></> : catalog.plugins.length ? <div className="studio-plugin-list">{catalog.plugins.map((plugin, index) => <Link to={`/p/${encodeURIComponent(plugin.slug)}`} key={plugin.slug}><span>{String(index + 1).padStart(2, '0')}</span><strong>{plugin.name || plugin.slug}</strong><span>打开 ↗</span></Link>)}</div> : <p role="status">暂未发布插件。首页与博客仍然可以正常访问。</p>}
              {user?.role === 'admin' && <button type="button" onClick={onOpenAdmin}>打开插件管理</button>}
            </div> :
            isDesk ? <ContentDesk plugins={catalog.plugins} user={user} onOpenSignIn={onOpenSignIn} /> :
            slug ? <PluginPage slug={slug} {...pageProps} showDrawer={Boolean(user)} portalTarget={document.getElementById("root")} /> :
            <div className="plugin-shell__empty">
              {catalog.loading ? <p role="status">正在加载页面列表…</p> : catalog.error ? <><p role="alert">{catalog.error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>重试</button></> : <>
                <h1>{location.pathname === '/' ? '还没有已发布的页面' : '页面不存在'}</h1>
                <p>这个页面尚未就绪。<Link to="/">返回首页</Link>，或<Link to="/plugins">浏览插件</Link>。</p>
              </>}
              {user?.role === 'admin' ? <button type="button" onClick={onOpenAdmin}>打开插件管理</button> : !user && <button type="button" onClick={onOpenSignIn}>管理员登录</button>}
            </div>}
        </section>
      </main>

      {createPortal(<>
      <SignInModal
        open={showSignIn}
        onClose={onCloseSignIn}
        onLogin={onLogin}
        onNotify={onNotify}
      />

      <AdminPanel
        open={showAdmin}
        onClose={onCloseAdmin}
        user={user}
        onNotify={onNotify}
      />

      <InfoModal
        open={Boolean(info)}
        title={info?.title}
        message={info?.message}
        variant={info?.variant}
        onClose={() => setInfo(null)}
      />
      </>, document.getElementById("root"))}
    </div>
  );
}
