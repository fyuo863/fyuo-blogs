import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Navbar from "./module/Navbar";
import Footer from "./module/Footer";
import SignInModal from "./components/SignInModal";
import InfoModal from "./components/InfoModal";
import AdminPanel from "./components/AdminPanel";

function AppLayout({ user, showSignIn, showAdmin, onOpenAdmin, onCloseAdmin, onOpenSignIn, onCloseSignIn, onLogin, onLogout, onNotify }) {
  const drawerItems = user
    ? [...(user.role === "admin" ? [{ label: "admin.", onClick: onOpenAdmin }] : []), { label: "exit.", onClick: onLogout }]
    : [];

  return (
    <>
      <Navbar visible />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home user={user} onOpenSignIn={onOpenSignIn} onNotify={onNotify} drawerItems={drawerItems} />} />
          <Route path="/blog" element={<Blog user={user} onOpenSignIn={onOpenSignIn} onLogout={onLogout} onNotify={onNotify} drawerItems={drawerItems} />} />
        </Routes>
      </main>
      <Footer />
      <SignInModal open={showSignIn} onClose={onCloseSignIn} onLogin={onLogin} onNotify={onNotify} />
      <AdminPanel open={showAdmin} onClose={onCloseAdmin} user={user} onNotify={onNotify} />
    </>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      return parsed?.token ? parsed : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [info, setInfo] = useState(null);
  const notify = (next) => setInfo({ variant: "info", title: "info.", message: "", ...next });
  const handleLogin = (profile) => {
    const nextUser = { id: profile.id, name: profile.name, role: profile.role, token: profile.token };
    setUser(nextUser);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setShowSignIn(false);
  };
  const handleLogout = () => { setUser(null); setShowAdmin(false); localStorage.removeItem("user"); };

  return <BrowserRouter><AppLayout user={user} showSignIn={showSignIn} showAdmin={showAdmin} onOpenAdmin={() => setShowAdmin(true)} onCloseAdmin={() => setShowAdmin(false)} onOpenSignIn={() => setShowSignIn(true)} onCloseSignIn={() => setShowSignIn(false)} onLogin={handleLogin} onLogout={handleLogout} onNotify={notify} /><InfoModal open={Boolean(info)} title={info?.title} message={info?.message} variant={info?.variant} onClose={() => setInfo(null)} /></BrowserRouter>;
}

export default App;
