import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminPanel from '../components/AdminPanel';
import SignInModal from '../components/SignInModal';
import InfoModal from '../components/InfoModal';
import ContentManager from './ContentManager';
import './admin.css';

export default function AdminApp() {
  const { user, login, logout } = useAuth();
  const [section, setSection] = useState('plugins');
  const [signIn, setSignIn] = useState(!user);
  const [info, setInfo] = useState(null);
  const notify = value => setInfo(value);
  return <BrowserRouter><main className="secure-admin">
    <header><h1>fyuo-control.</h1><nav aria-label="管理导航">
      {user?.role === 'admin' && <button aria-pressed={section === 'plugins'} onClick={() => setSection('plugins')}>插件与权限</button>}
      <button aria-pressed={section === 'content' || user?.role !== 'admin'} onClick={() => setSection('content')}>内容编辑</button>
      <a href="https://fyuoblog.top/" rel="noopener noreferrer">查看网站</a>
      {user ? <button onClick={() => logout().catch(error => notify({title:'退出失败',message:error.message}))}>退出登录</button> : <button onClick={() => setSignIn(true)}>登录</button>}
    </nav></header>
    {!user ? <p>请登录管理中心。</p> : section === 'plugins' && user.role === 'admin'
      ? <AdminPanel open user={user} onClose={() => setSection('content')} onNotify={notify} />
      : <ContentManager token={user.token} />}
    <SignInModal open={signIn} onClose={() => setSignIn(false)} onLogin={profile => { login(profile); setSignIn(false); }} onNotify={notify} />
    <InfoModal open={Boolean(info)} title={info?.title} message={info?.message} variant={info?.variant} onClose={() => setInfo(null)} />
  </main></BrowserRouter>;
}
