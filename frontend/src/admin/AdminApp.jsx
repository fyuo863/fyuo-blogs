import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import StudioFrame from '../layout/StudioFrame';
import StudioHome from '../pages/StudioHome';
import ContentManager from './ContentManager';
import { createPortal } from 'react-dom';

export default function AdminApp() {
  const { user, login, logout } = useAuth();
  const [panelOpen, setPanelOpen] = useState(() => new URLSearchParams(window.location.search).get('manage') === '1');
  const [signInOpen, setSignInOpen] = useState(() => !user && new URLSearchParams(window.location.search).get('manage') === '1');
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('manage')) {
      url.searchParams.delete('manage');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    }
  }, []);
  const [info, setInfo] = useState(null);
  const close = () => setPanelOpen(false);
  const open = () => setPanelOpen(true);
  const signOut = () => logout().then(close).catch(error => setInfo({ title:'退出失败', message:error.message }));
  return <BrowserRouter>
    <StudioFrame user={user} showSignIn={signInOpen} showAdmin={panelOpen && !signInOpen && user?.role === 'admin'}
      onOpenAdmin={open} onCloseAdmin={close} onOpenSignIn={() => setSignInOpen(true)} onCloseSignIn={() => { setSignInOpen(false); close(); }}
      onLogin={login} onLogout={signOut}
      onNotify={setInfo} info={info} setInfo={setInfo} navigationOrigin="https://fyuoblog.top">
      <main className="plugin-shell__canvas" id="plugin-canvas">
        <section className="single-page-reader plugin-shell__reader"><StudioHome navigationOrigin="https://fyuoblog.top" /></section>
      </main>
      {panelOpen && user && user.role !== 'admin' && createPortal(
        <div className="admin-panel" role="dialog" aria-modal="true" aria-label="内容管理">
          <div className="admin-panel__surface"><div className="admin-panel__content">
            <button className="admin-panel__close" aria-label="Close admin panel" onClick={close}>×</button>
            <div className="admin-panel__page p-6"><ContentManager token={user.token} /></div>
          </div></div>
        </div>, document.getElementById('root'))}
    </StudioFrame>
  </BrowserRouter>;
}
