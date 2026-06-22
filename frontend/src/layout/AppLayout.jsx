import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../module/Navbar";
import Footer from "../module/Footer";

import SignInModal from "../components/SignInModal";
import InfoModal from "../components/InfoModal";
import AdminPanel from "../components/AdminPanel";

import Home from "../pages/Home";
import Blog from "../pages/Blog";

import { useSplash } from "../hooks/useSplash";

export default function AppLayout({
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
  info,
  setInfo,
}) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const { splashPhase, shouldShowSplash, showNav, finishSplash } =
    useSplash(isHome);

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
      {/* Splash 背景遮罩 */}
      {shouldShowSplash && (
        <div
          className={`fixed inset-0 z-[100] bg-black transition-opacity duration-[1000ms] ease-out ${
            splashPhase === "exiting"
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget) {
              finishSplash();
            }
          }}
        />
      )}

      {/* Splash 居中标题 */}
      {shouldShowSplash && (
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

      <InfoModal
        open={Boolean(info)}
        title={info?.title}
        message={info?.message}
        variant={info?.variant}
        onClose={() => setInfo(null)}
      />
    </>
  );
}