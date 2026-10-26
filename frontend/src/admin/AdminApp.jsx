import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SignInModal from '../components/SignInModal';
import AdminPanel from '../components/AdminPanel';
import InfoModal from '../components/InfoModal';
import ContentManager from './ContentManager';
import { ADMIN_ORIGIN, PUBLIC_ORIGIN } from '../services/origins';
import '../layout/studio.css';
import './remote-management.css';

const embedded = window.parent !== window;
const channel = 'fyuo-management-v1';
const parentOrigins = new Set([PUBLIC_ORIGIN, ADMIN_ORIGIN]);
const requestedParent = new URLSearchParams(window.location.search).get('parent');
const parentOrigin = parentOrigins.has(requestedParent) ? requestedParent : PUBLIC_ORIGIN;
function send(type, data = {}) {
  if (embedded) window.parent.postMessage({ channel, type, ...data }, parentOrigin);
}

export default function AdminApp() {
  const { user, login, logout } = useAuth();
  const [mode, setMode] = useState(embedded ? null : 'open');
  const [info, setInfo] = useState(null);
  const showSignIn = mode === 'signin' || (mode === 'open' && !user);
  const showAdmin = mode === 'admin' || (mode === 'open' && Boolean(user));
  const close = () => { setMode(null); setInfo(null); send('closed'); };
  useEffect(() => {
    document.documentElement.classList.add('management-document');
    const pluginsChanged = () => send('plugins-changed');
    window.addEventListener('fyuo:plugins-changed', pluginsChanged);
    return () => { document.documentElement.classList.remove('management-document'); window.removeEventListener('fyuo:plugins-changed', pluginsChanged); };
  }, []);
  useEffect(() => {
    const receive = event => {
      if (event.source !== window.parent || event.origin !== parentOrigin || event.data?.channel !== channel) return;
      if (event.data.type === 'open') setMode(user ? 'admin' : 'signin');
      if (event.data.type === 'logout') {
        logout().then(() => { setMode(null); setInfo(null); send('closed'); }).catch(error => {
          setMode('admin'); setInfo({ title:'退出失败', message:error.message, variant:'error' }); send('visible');
        });
      }
    };
    window.addEventListener('message', receive);
    send('ready');
    // Only presentation state crosses origins. Never send a profile or token.
    send('session', { authenticated:Boolean(user), role:user?.role === 'admin' ? 'admin' : 'publisher' });
    return () => window.removeEventListener('message', receive);
  }, [user, logout]);
  useEffect(() => {
    if (!mode) return undefined;
    const timer = requestAnimationFrame(() => document.querySelector('[role="dialog"] input, [role="dialog"] button')?.focus());
    const keydown = event => {
      if (event.key === 'Escape') { setMode(null); setInfo(null); send('closed'); }
      if (event.key !== 'Tab') return;
      const dialog = document.querySelector('[role="dialog"]');
      const elements = [...(dialog?.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]') || [])].filter(el => el.getClientRects().length);
      const first = elements[0], last = elements.at(-1);
      if (event.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', keydown);
    return () => { cancelAnimationFrame(timer); window.removeEventListener('keydown', keydown); };
  }, [mode]);
  return <BrowserRouter>
    {/* Shared theme scope without a second page behind the dialog. */}
    <div className="studio-shell management-theme" aria-hidden="true" />
    <SignInModal open={showSignIn} onClose={close} onLogin={login} onNotify={setInfo} />
    <AdminPanel open={showAdmin && user?.role === 'admin'} onClose={close} user={user} onNotify={setInfo} />
    {showAdmin && user && user.role !== 'admin' && <div className="admin-panel" role="dialog" aria-modal="true" aria-label="内容管理"><div className="admin-panel__surface"><div className="admin-panel__content">
      <button className="admin-panel__close" aria-label="Close admin panel" onClick={close}>×</button>
      <div className="admin-panel__page p-6"><ContentManager token={user.token} /></div>
    </div></div></div>}
    <InfoModal open={Boolean(info)} title={info?.title} message={info?.message} variant={info?.variant} onClose={() => setInfo(null)} />
    {!embedded && !mode && <a href={PUBLIC_ORIGIN}>返回网站</a>}
  </BrowserRouter>;
}
