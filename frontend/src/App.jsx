import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Navbar from "./module/Navbar";
import Footer from "./module/Footer";
import SignInModal from "./components/SignInModal";
import InfoModal from "./components/InfoModal";
import AdminPanel from "./components/AdminPanel";

function AppLayout({
  user,
  showSignIn,
  showAdmin,
  onOpenAdmin,
  onCloseAdmin,
  onOpenSignIn,
  onCloseSignIn,
  onLogin,
  onLogout,
  onNotify,
}) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const splashPlayedRef = useRef(false);
  const [splashPhase, setSplashPhase] = useState("visible");
  const splashStartRef = useRef(0);

  useEffect(() => {
    if (!isHome || splashPlayedRef.current) {
      setSplashPhase("done");
      return;
    }
    if (splashStartRef.current === 0) {
      splashStartRef.current = Date.now();
    }
    const elapsed = Date.now() - splashStartRef.current;
    const remaining = Math.max(0, 3000 - elapsed);
    const timer = setTimeout(() => setSplashPhase("exiting"), remaining);
    return () => clearTimeout(timer);
  }, [isHome]);

  const handleSplashDone = () => {
    setSplashPhase("done");
    splashPlayedRef.current = true;
  };

  const showNav = splashPhase === "done" || !isHome;
  const drawerItems = user
    ? [
        ...(user.role === "admin"
          ? [{ label: "admin.", onClick: onOpenAdmin }]
          : []),
        { label: "exit.", onClick: onLogout },
      ]
    : [];

  return (
    <>
      {/* Splash 背景遮罩（仅首页首次访问） */}
      {isHome && splashPhase !== "done" && (
        <div
          className={`fixed inset-0 z-[100] bg-black transition-opacity duration-[1000ms] ease-out ${
            splashPhase === "exiting"
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget) handleSplashDone();
          }}
        />
      )}

      {/* Splash 居中标题（仅首页首次访问） */}
      {isHome && splashPhase !== "done" && (
        <div
          className={`fixed z-[110] italic transition-all duration-[1000ms] ease-out ${
            splashPhase === "exiting"
              ? "top-0 left-0 px-4 py-4 sm:px-6 lg:px-8"
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          }`}
        >
          <span
            className={`font-bold tracking-tight text-white select-none transition-all duration-[1000ms] ease-out ${
              splashPhase === "exiting" ? "text-lg" : "text-7xl"
            }`}
          >
            {"fyuo-blogs.".split("").map((char, i) => (
              <span
                key={i}
                className={
                  splashPhase === "visible"
                    ? "inline-block animate-bounce"
                    : "inline-block"
                }
                style={
                  splashPhase === "visible"
                    ? { animationDelay: `${i * 0.07}s`, transform: "translateY(-25%)" }
                    : {}
                }
              >
                {char}
              </span>
            ))}
          </span>
        </div>
      )}

      {/* 全局顶栏（标题 + 导航 + GitHub） */}
      <Navbar visible={showNav} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={user}
              onOpenSignIn={onOpenSignIn}
              drawerItems={drawerItems}
            />
          }
        />
        <Route
          path="/blog"
          element={
            <Blog
              user={user}
              onOpenSignIn={onOpenSignIn}
              onLogout={onLogout}
              onNotify={onNotify}
              drawerItems={drawerItems}
            />
          }
        />
      </Routes>

      <Footer />

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
    </>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.token) return parsed;
    } catch {
      // Ignore stale or malformed local login state.
    }
    localStorage.removeItem("user");
    return null;
  });
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [info, setInfo] = useState(null);

  const notify = (next) => {
    setInfo({
      variant: "info",
      title: "info.",
      message: "",
      ...next,
    });
  };

  const handleLogin = (profile) => {
    const u = {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      token: profile.token,
    };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    setShowSignIn(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowAdmin(false);
    localStorage.removeItem("user");
  };

  return (
    <BrowserRouter>
      <AppLayout
        user={user}
        showSignIn={showSignIn}
        showAdmin={showAdmin}
        onOpenAdmin={() => setShowAdmin(true)}
        onCloseAdmin={() => setShowAdmin(false)}
        onOpenSignIn={() => setShowSignIn(true)}
        onCloseSignIn={() => setShowSignIn(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNotify={notify}
      />
      <InfoModal
        open={Boolean(info)}
        title={info?.title}
        message={info?.message}
        variant={info?.variant}
        onClose={() => setInfo(null)}
      />
    </BrowserRouter>
  );
}

export default App;
