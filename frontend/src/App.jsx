import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import SignInModal from "./components/SignInModal";

const GithubIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

function AppLayout({ user, showSignIn, onOpenSignIn, onCloseSignIn, onLogin, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
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
      <div
        className={`fixed top-0 left-0 right-0 z-[110] px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between transition-opacity duration-500 ease-out ${
          showNav ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate("/")}
            className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors italic"
          >
            fyuo-blogs.
          </button>
          <nav className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className={`text-lg font-bold tracking-tight transition-colors ${
                isHome ? "text-white" : "text-zinc-500 hover:text-white"
              }`}
            >
              home.
            </button>
            <button
              onClick={() => navigate("/blog")}
              className={`text-lg font-bold tracking-tight transition-colors ${
                !isHome ? "text-white" : "text-zinc-500 hover:text-white"
              }`}
            >
              blogs.
            </button>
          </nav>
        </div>

        <a
          href="https://github.com/fyuo863"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:block text-zinc-500 hover:text-white transition-colors"
        >
          <GithubIcon size={20} />
        </a>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <Home
              user={user}
              onOpenSignIn={onOpenSignIn}
              onLogout={onLogout}
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
            />
          }
        />
      </Routes>

      <SignInModal
        open={showSignIn}
        onClose={onCloseSignIn}
        onLogin={onLogin}
      />
    </>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [showSignIn, setShowSignIn] = useState(false);

  const handleLogin = (name, password) => {
    const u = { name, password };
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    setShowSignIn(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <BrowserRouter>
      <AppLayout
        user={user}
        showSignIn={showSignIn}
        onOpenSignIn={() => setShowSignIn(true)}
        onCloseSignIn={() => setShowSignIn(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
}

export default App;
