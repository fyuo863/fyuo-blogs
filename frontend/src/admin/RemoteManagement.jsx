import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ADMIN_ORIGIN } from '../services/origins';
import './remote-management.css';

export default function RemoteManagement({ open, request, onSession, onClose, onOpen }) {
  const frame = useRef(null);
  const previousFocus = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const receive = event => {
      if (event.origin !== ADMIN_ORIGIN || event.source !== frame.current?.contentWindow || event.data?.channel !== 'fyuo-management-v1') return;
      if (event.data.type === 'ready') setReady(true);
      if (event.data.type === 'session') onSession(event.data.authenticated === true ? { role:event.data.role === 'admin' ? 'admin' : 'publisher' } : null);
      if (event.data.type === 'closed') onClose();
      if (event.data.type === 'visible') onOpen();
      if (event.data.type === 'plugins-changed') window.dispatchEvent(new Event('fyuo:plugins-changed'));
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [onSession, onClose, onOpen]);
  useEffect(() => {
    if (ready && request) frame.current?.contentWindow.postMessage({ channel:'fyuo-management-v1', type:request.type }, ADMIN_ORIGIN);
  }, [ready, request]);
  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement;
    const siblings = [...document.getElementById('root').children].filter(el => !el.classList.contains('remote-management'));
    const prior = siblings.map(el => el.inert);
    siblings.forEach(el => { el.inert = true; });
    frame.current?.focus();
    return () => { siblings.forEach((el, i) => { el.inert = prior[i]; }); previousFocus.current?.focus(); };
  }, [open]);
  useEffect(() => {
    if (ready || !open) return undefined;
    const timer = setTimeout(() => setFailed(true), 15000);
    return () => clearTimeout(timer);
  }, [ready, open, attempt]);
  return createPortal(<div className="remote-management" hidden={!open}>
    <iframe ref={frame} key={attempt} title="登录与管理弹窗" src={`${ADMIN_ORIGIN}/manage?parent=${encodeURIComponent(window.location.origin)}`} aria-label="登录与管理弹窗" />
    {!ready && <div className="remote-management__status" role="status">{failed ? <>
      <p>管理窗口加载失败，请重试。</p><button onClick={() => { setFailed(false); setAttempt(value => value + 1); }}>重试</button>
    </> : <p>正在加载管理窗口…</p>}<button onClick={onClose}>关闭</button></div>}
  </div>, document.getElementById('root'));
}
