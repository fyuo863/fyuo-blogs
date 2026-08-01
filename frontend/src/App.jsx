import { useState, useRef, useEffect, useLayoutEffect } from "react";
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
import PhysicsPage from "./physics/PhysicsPage";
import PointerField from "./components/PointerField";

const PHYSICS_EVENT_NAME = "fyuo:route-physics-start";

/**
 * 新页面加载/渲染完成后，再触发旧页面松动下落。
 * 如果你的 blog 页面请求数据慢，可以把 180 调大到 300 / 500。
 */
const NEXT_PAGE_READY_DELAY = 180;

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

  const firstRouteRef = useRef(true);

  const splashPlayedRef = useRef(false);
  const splashStartRef = useRef(0);

  const [splashPhase, setSplashPhase] = useState(() => {
    return isHome ? "visible" : "done";
  });

  /**
   * 路由变化后：
   * 1. 等新页面完成至少两帧渲染
   * 2. 再额外等待 NEXT_PAGE_READY_DELAY
   * 3. 触发旧页面 PhysicsPage 的物理下落
   *
   * 首次进入页面不触发。
   */
  useLayoutEffect(() => {
    if (firstRouteRef.current) {
      firstRouteRef.current = false;
      return;
    }

    let timer = null;
    let frame1 = null;
    let frame2 = null;

    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        timer = setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent(PHYSICS_EVENT_NAME, {
              detail: {
                pathname: location.pathname,
              },
            })
          );
        }, NEXT_PAGE_READY_DELAY);
      });
    });

    return () => {
      if (frame1) {
        cancelAnimationFrame(frame1);
      }

      if (frame2) {
        cancelAnimationFrame(frame2);
      }

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [location.pathname]);

  /**
   * 首页 splash：
   * 只在首次进入首页显示。
   */
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
    const remaining = Math.max(0, 900 - elapsed);

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
          className={`fixed inset-0 z-[100] bg-black transition-opacity duration-[450ms] ease-out ${
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
          className={`fixed z-[110] transition-all duration-[450ms] ease-out ${
            splashPhase === "exiting"
              ? "top-0 left-0 px-4 py-4 sm:px-6 lg:px-8"
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          }`}
        >
          <span
            className={`font-bold tracking-tight text-white select-none transition-all duration-[1000ms] ease-out ${
              splashPhase === "exiting" ? "text-lg" : "text-6xl"
            }`}
          >
            {"fyuo-blogs.".split("").map((char, i) => (
              <span
                key={`${char}-${i}`}
                className={
                  "inline-block"
                }
                style={
                  splashPhase === "visible" ? { opacity: 0.86 + i * 0.01 } : undefined
                }
              >
                {char}
              </span>
            ))}
          </span>
        </div>
      )}

      <Navbar visible={showNav} />
      <PointerField />

      <div className="app-shell">
        <AnimatePresence mode="sync" initial={false}>
          <PhysicsPage key={location.pathname}>
            <Routes location={location}>
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
          </PhysicsPage>
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

    if (!saved) {
      return null;
    }

    try {
      const parsed = JSON.parse(saved);

      if (parsed?.token) {
        return parsed;
      }
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
