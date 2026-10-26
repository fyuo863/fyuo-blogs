import AdminApp from "./admin/AdminApp";
import { isAdminOrigin, isLocalDevelopment, isManagementDocument } from "./services/origins";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from 'react';
import RemoteManagement from './admin/RemoteManagement';

import PluginPage from "./components/PluginPage";

import AppLayout from "./layout/AppLayout";
import { useAuth } from "./hooks/useAuth";
import { useUIStore } from "./store/useUIStore";

function MainApp() {
  const { user, login, logout } = useAuth();
  const ui = useUIStore();
  const [session, setSession] = useState(null);
  const [request, setRequest] = useState(null);
  const [remoteOpen, setRemoteOpen] = useState(false);
  const remote = !isLocalDevelopment;
  const openRemote = () => { setRemoteOpen(true); setRequest({ type:'open' }); };
  useEffect(() => {
    const receive = event => {
      if (!isAdminOrigin || event.origin !== 'https://fyuoblog.top' || event.data?.channel !== 'fyuo-public-plugin-v1' || event.data.type !== 'open-management') return;
      if (![...document.querySelectorAll('.public-plugin-frame')].some(frame => frame.contentWindow === event.source)) return;
      setRemoteOpen(true); setRequest({ type:'open' });
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);

  return (
    <BrowserRouter>
      <AppLayout
        user={user}
        navigationUser={remote ? session : user}
        showSignIn={ui.showSignIn}
        showAdmin={ui.showAdmin}
        onOpenAdmin={remote ? openRemote : () => ui.setShowAdmin(true)}
        onCloseAdmin={() => ui.setShowAdmin(false)}
        onOpenSignIn={remote ? openRemote : () => ui.setShowSignIn(true)}
        onCloseSignIn={() => ui.setShowSignIn(false)}
        onLogin={login}
        onLogout={remote ? () => setRequest({ type:'logout' }) : logout}
        onNotify={ui.notify}
        info={ui.info}
        setInfo={ui.setInfo}
      />
      {remote && <RemoteManagement open={remoteOpen} request={request} onSession={setSession} onOpen={() => setRemoteOpen(true)} onClose={() => setRemoteOpen(false)} />}
    </BrowserRouter>
  );
}


export default function App() {
  // Before preview handling: the admin origin must never execute a plugin.
  if (isManagementDocument) return <AdminApp />;
  const params = new URLSearchParams(window.location.search);
  if (!isAdminOrigin && (params.get("__plugin_preview") === "1" || params.get('__plugin_embed') === '1')) {
    let slug;
    try { slug = decodeURIComponent(window.location.pathname.split("/")[2] || "index"); }
    catch { slug = "missing"; }
    return <BrowserRouter><div className="plugin-shell"><div className="single-page-reader plugin-shell__reader">
      <PluginPage slug={slug} user={null} drawerItems={[]} showDrawer={false} portalTarget={document.getElementById("root")}
        onOpenSignIn={() => window.parent.postMessage({channel:'fyuo-public-plugin-v1',type:'open-management'}, 'https://www.fyuoblog.top')} />
    </div></div></BrowserRouter>;
  }
  return <MainApp />;
}
