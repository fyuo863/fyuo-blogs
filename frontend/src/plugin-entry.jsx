import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import SignInModal from "./components/SignInModal";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Travel from "./pages/Travel";
import "./index.css";

const pluginId = document.documentElement.dataset.plugin || "index";

export default function PluginEntry() {
  const { user, login, logout } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [notice, setNotice] = useState(null);
  const notify = (message) => { setNotice(message); window.setTimeout(() => setNotice(null), 3200); };
  const props = { user, onOpenSignIn: () => setShowSignIn(true), onLogout: logout, onNotify: notify };
  return <BrowserRouter>
    <div className={`plugin-root plugin-root--${pluginId}`}>
      {pluginId === "journal" ? <Blog {...props} /> : pluginId === "travel" ? <Travel {...props} /> : <Home {...props} />}
      {notice && <div className="plugin-notice" role="status">{notice.message || notice}</div>}
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} onLogin={(profile) => { login(profile); setShowSignIn(false); }} onNotify={notify} />
    </div>
  </BrowserRouter>;
}
