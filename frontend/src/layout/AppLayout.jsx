import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";

import PluginSidebar from "../components/PluginSidebar";
import "./plugin-shell.css";

import SignInModal from "../components/SignInModal";
import InfoModal from "../components/InfoModal";
import AdminPanel from "../components/AdminPanel";

import ContentDesk from "../pages/ContentDesk";
import PluginPage from "../components/PluginPage";

function pluginForPath(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path.startsWith("/p/")) {
    try { return decodeURIComponent(path.split("/")[2]); }
    catch { return "missing"; }
  }
  return { "/": "index", "/blog": "journal", "/travel": "travel" }[path] || "index";
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

  return (
    <div className="plugin-shell">
      <main className="plugin-shell__canvas" id="plugin-canvas">
        <section key={isDesk ? "desk" : slug} className="single-page-reader plugin-shell__reader">
          {isDesk ? <ContentDesk user={user} onOpenSignIn={onOpenSignIn} /> :
            <PluginPage slug={slug} {...pageProps} showDrawer={Boolean(user)} portalTarget={document.getElementById("root")} />}
        </section>
      </main>
      <PluginSidebar activeSlug={isDesk ? null : slug} user={user} onOpenSignIn={onOpenSignIn} onOpenAdmin={onOpenAdmin} onLogout={onLogout} />

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
