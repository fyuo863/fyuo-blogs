import { createPortal } from 'react-dom';
import { Link, NavLink } from 'react-router-dom';
import { UserRound, Settings, LogOut } from 'lucide-react';
import GithubIcon from '../module/GithubIcon';
import SignInModal from '../components/SignInModal';
import AdminPanel from '../components/AdminPanel';
import InfoModal from '../components/InfoModal';
import './plugin-shell.css';
import './studio.css';

// Presentation shared by the local host and the isolated production manager.
// Page/plugin selection belongs to the caller; this frame never loads plugins.
export default function StudioFrame({ children, user, showSignIn, showAdmin,
  onOpenAdmin, onCloseAdmin, onOpenSignIn, onCloseSignIn, onLogin, onLogout,
  onNotify, info, setInfo, navigationOrigin = '' }) {
  const destination = path => `${navigationOrigin}${path}`;
  return <div className="plugin-shell studio-shell">
      <header className="studio-nav">
        <Link className="studio-wordmark" to={destination("/")} aria-label="FYUO 首页">FYUO<span>®</span></Link>
        <nav aria-label="主导航">
          <NavLink to={destination("/")} end className={navigationOrigin ? "active" : undefined}>HOME<span>首页</span></NavLink>
          <NavLink to={destination("/blog")}>JOURNAL<span>博客</span></NavLink>
          <NavLink to={destination("/plugins")}>PLAYGROUND<span>插件</span></NavLink>
        </nav>
        <div className="studio-nav__actions">
          <a href="https://github.com/fyuo863" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><GithubIcon size={19} /></a>
          <button type="button" aria-label={user ? '管理后台' : 'log-in.'} title={user ? '管理后台' : '登录'} onClick={user?.role === 'admin' ? onOpenAdmin : onOpenSignIn}>{user ? <Settings size={19} /> : <UserRound size={19} />}</button>
          {user && <button type="button" aria-label="退出" title="退出" onClick={onLogout}><LogOut size={19} /></button>}
        </div>
      </header>
      {children}
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
    </div>;
}
