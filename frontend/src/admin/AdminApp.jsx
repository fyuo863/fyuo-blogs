import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import StudioFrame from '../layout/StudioFrame';
import StudioHome from '../pages/StudioHome';
import ContentManager from './ContentManager';
import { createPortal } from 'react-dom';

export default function AdminApp() {
  const { user, login, logout } = useAuth();
  const [panelOpen, setPanelOpen] = useState(true);
  const [info, setInfo] = useState(null);
  const close = () => setPanelOpen(false);
  const open = () => setPanelOpen(true);
  const signOut = () => logout().then(open).catch(error => setInfo({ title:'退出失败', message:error.message }));
  return <BrowserRouter>
    <StudioFrame user={user} showSignIn={panelOpen && !user} showAdmin={panelOpen && user?.role === 'admin'}
      onOpenAdmin={open} onCloseAdmin={close} onOpenSignIn={open} onCloseSignIn={close}
      onLogin={profile => { login(profile); open(); }} onLogout={signOut}
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
