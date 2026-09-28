import { useEffect, useState } from "react";
import { listPlugins } from "../plugins/pluginApi";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";

import PluginSidebar from "../components/PluginSidebar";
import "./plugin-shell.css";

import SignInModal from "../components/SignInModal";
import InfoModal from "../components/InfoModal";
import AdminPanel from "../components/AdminPanel";

import ContentDesk from "../pages/ContentDesk";
import PluginPage from "../components/PluginPage";

function pluginForPath(pathname, plugins) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path.startsWith("/p/")) {
    try { return decodeURIComponent(path.split("/")[2]); }
    catch { return "missing"; }
  }
  if (path === "/") return plugins[0]?.slug || null;
  return { "/blog": "journal", "/travel": "travel" }[path] || null;
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
  const slug = pluginForPath(location.pathname, catalog.plugins);

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

  return (
    <div className="plugin-shell">
      <main className="plugin-shell__canvas" id="plugin-canvas">
        <section key={isDesk ? "desk" : slug} className="single-page-reader plugin-shell__reader">
          {isDesk ? <ContentDesk plugins={catalog.plugins} user={user} onOpenSignIn={onOpenSignIn} /> :
            slug ? <PluginPage slug={slug} {...pageProps} showDrawer={Boolean(user)} portalTarget={document.getElementById("root")} /> :
            <div className="plugin-shell__empty">
              {catalog.loading ? <p role="status">正在加载页面列表…</p> : catalog.error ? <><p role="alert">{catalog.error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>重试</button></> : <>
                <h1>{location.pathname === '/' ? '还没有已发布的页面' : '页面不存在'}</h1>
                <p>{user?.role === 'admin' ? '进入插件管理，上传 ZIP 并发布，即可显示页面。排序第一的插件将作为首页。' : '站点页面尚未就绪，请稍后再来。'}</p>
              </>}
              {user?.role === 'admin' ? <button type="button" onClick={onOpenAdmin}>打开插件管理</button> : !user && <button type="button" onClick={onOpenSignIn}>管理员登录</button>}
            </div>}
        </section>
      </main>
      <PluginSidebar plugins={catalog.plugins} activeSlug={isDesk ? null : slug} user={user} onOpenSignIn={onOpenSignIn} onOpenAdmin={onOpenAdmin} onLogout={onLogout} />

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
