import AdminApp from "./admin/AdminApp";
import { isAdminOrigin, isPublicOrigin, openAdmin } from "./services/origins";
import { BrowserRouter } from "react-router-dom";

import PluginPage from "./components/PluginPage";

import AppLayout from "./layout/AppLayout";
import { useAuth } from "./hooks/useAuth";
import { useUIStore } from "./store/useUIStore";

function MainApp() {
  const { user, login, logout } = useAuth();
  const ui = useUIStore();

  return (
    <BrowserRouter>
      <AppLayout
        user={user}
        showSignIn={ui.showSignIn}
        showAdmin={ui.showAdmin}
        onOpenAdmin={isPublicOrigin ? openAdmin : () => ui.setShowAdmin(true)}
        onCloseAdmin={() => ui.setShowAdmin(false)}
        onOpenSignIn={isPublicOrigin ? openAdmin : () => ui.setShowSignIn(true)}
        onCloseSignIn={() => ui.setShowSignIn(false)}
        onLogin={login}
        onLogout={logout}
        onNotify={ui.notify}
        info={ui.info}
        setInfo={ui.setInfo}
      />
    </BrowserRouter>
  );
}


export default function App() {
  // Before preview handling: the admin origin must never execute a plugin.
  if (isAdminOrigin) return <AdminApp />;
  const params = new URLSearchParams(window.location.search);
  if (params.get("__plugin_preview") === "1") {
    let slug;
    try { slug = decodeURIComponent(window.location.pathname.split("/")[2] || "index"); }
    catch { slug = "missing"; }
    return <BrowserRouter><div className="plugin-shell"><div className="single-page-reader plugin-shell__reader">
      <PluginPage slug={slug} user={null} drawerItems={[]} showDrawer={false} portalTarget={document.getElementById("root")} />
    </div></div></BrowserRouter>;
  }
  return <MainApp />;
}
