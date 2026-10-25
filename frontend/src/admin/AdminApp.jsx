import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminPanel from '../components/AdminPanel';
import SignInModal from '../components/SignInModal';
import InfoModal from '../components/InfoModal';
import ContentManager from './ContentManager';
import './admin.css';
import '../layout/studio.css';

export default function AdminApp() {
  const { user, login, logout } = useAuth();
  const [info, setInfo] = useState(null);
  const notify = value => setInfo(value);
  return <BrowserRouter><main className={`secure-admin${!user ? ' secure-admin--login' : ''}`}>
    <header><h1>fyuo-control.</h1><nav aria-label="管理导航">
      <a href="https://fyuoblog.top/" rel="noopener noreferrer">查看网站</a>
      {user && <button onClick={() => logout().catch(error => notify({title:'退出失败',message:error.message}))}>退出登录</button>}
    </nav></header>
    {!user ? <section className="secure-admin__login" aria-label="管理中心登录">
      <SignInModal open embedded onLogin={login} />
    </section> : user.role === 'admin'
      ? <AdminPanel open user={user} onClose={() => window.location.assign('https://fyuoblog.top/')} onNotify={notify} />
      : <ContentManager token={user.token} />}
    <InfoModal open={Boolean(info)} title={info?.title} message={info?.message} variant={info?.variant} onClose={() => setInfo(null)} />
  </main></BrowserRouter>;
}
