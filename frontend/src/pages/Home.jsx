import { useState, useRef, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Navbar from "./module/Navbar";
import Footer from "./module/Footer";
import SignInModal from "./components/SignInModal";
import InfoModal from "./components/InfoModal";
import AdminPanel from "./components/AdminPanel";
import GravityPage from "./animations/GravityPage";

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
  const splashStartRef = useRef(0);

  const [splashPhase, setSplashPhase] = useState(() => {
    return isHome ? "visible" : "done";
  });

  useEffect(() => {
    if (!isHome) {
      splashPlayedRef.current = true;
      return;
    }

    if (splashPlayedRef.current) {
      return;
    }

    if (splashPhase !== "visible") {
      return;
    }

    if (splashStartRef.current === 0) {
      splashStartRef.current = Date.now();
    }

    const elapsed = Date.now() - splashStartRef.current;
    const remaining = Math.max(0, 3000 - elapsed);

    const timer = setTimeout(() => {
      setSplashPhase("exiting");
    }, remaining);

    return () => clearTimeout(timer);
  }, [isHome, splashPhase]);

  const handleSplashDone = () => {
    splashPlayedRef.current = true;
    setSplashPhase("done");
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
      {isHome && splashPhase !== "done" && (
        <div
          className={`fixed inset-0 z-[100] bg-black transition-opacity duration-[1000ms] ease-out ${
            splashPhase === "exiting"
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget) {
              handleSplashDone();
            }
          }}
        />
      )}

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
                key={`${char}-${i}`}
                className={
                  splashPhase === "visible"
                    ? "inline-block animate-bounce"
                    : "inline-block"
                }
                style={
                  splashPhase === "visible"
                    ? {
                        animationDelay: `${i * 0.07}s`,
                        transform: "translateY(-25%)",
                      }
                    : undefined
                }
              >
                {char}
              </span>
            ))}
          </span>
        </div>
      )}

      <Navbar visible={showNav} />

      <div className="relative min-h-screen overflow-hidden bg-black">
        <AnimatePresence mode="sync" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <GravityPage>
                  <Home
                    user={user}
                    onOpenSignIn={onOpenSignIn}
                    drawerItems={drawerItems}
                  />
                </GravityPage>
              }
            />

            <Route
              path="/blog"
              element={
                <GravityPage>
                  <Blog
                    user={user}
                    onOpenSignIn={onOpenSignIn}
                    onLogout={onLogout}
                    onNotify={onNotify}
                    drawerItems={drawerItems}
                  />
                </GravityPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>

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