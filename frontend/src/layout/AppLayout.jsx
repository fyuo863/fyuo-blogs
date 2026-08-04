import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../module/Navbar";
import Footer from "../module/Footer";

import SignInModal from "../components/SignInModal";
import InfoModal from "../components/InfoModal";
import AdminPanel from "../components/AdminPanel";

import Home from "../pages/Home";
import Blog from "../pages/Blog";
import Travel from "../pages/Travel";

import { useSplash } from "../hooks/useSplash";

const PAGE_ORDER = ["home", "blog", "travel"];
const PAGE_PATHS = { home: "/", blog: "/blog", travel: "/travel" };

function pageKeyForPath(pathname) {
  return Object.entries(PAGE_PATHS).find(([, path]) => path === pathname)?.[0] ?? "home";
}

function useWideSpread() {
  const query = "(min-width: 72rem)";
  const [isWide, setIsWide] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setIsWide(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isWide;
}

function PageContent({ page, user, onOpenSignIn, onLogout, onNotify, drawerItems, showDrawer }) {
  if (page === "home") {
    return <Home user={user} onOpenSignIn={onOpenSignIn} onNotify={onNotify} drawerItems={drawerItems} showDrawer={showDrawer} />;
  }

  if (page === "blog") {
    return <Blog user={user} onOpenSignIn={onOpenSignIn} onLogout={onLogout} onNotify={onNotify} drawerItems={drawerItems} showDrawer={showDrawer} />;
  }

  return <Travel user={user} onOpenSignIn={onOpenSignIn} onNotify={onNotify} />;
}

function MobileRoutes(props) {
  return (
    <Routes>
      <Route path="/" element={<PageContent {...props} page="home" showDrawer />} />
      <Route path="/blog" element={<PageContent {...props} page="blog" showDrawer />} />
      <Route path="/travel" element={<PageContent {...props} page="travel" showDrawer={false} />} />
    </Routes>
  );
}

function MagazineSpread(props) {
  const location = useLocation();
  const spreadStart = pageKeyForPath(location.pathname) === "travel" ? 1 : 0;
  const visibleKeys = PAGE_ORDER.slice(spreadStart, spreadStart + 2);
  const drawerPage = visibleKeys.includes("blog") ? "blog" : visibleKeys.includes("home") ? "home" : null;

  return (
    <div className="magazine-spread" aria-label="Two-page magazine reader">
      <div className="magazine-spread__track" style={{ "--spread-offset": `${spreadStart * -33.333333}%` }}>
        {PAGE_ORDER.map((page, index) => {
          const isBuffered = index < spreadStart || index > spreadStart + 1;
          return (
            <section className={`magazine-spread__page${isBuffered ? " is-buffer" : ""}`} aria-label={`${page} page`} aria-hidden={isBuffered} inert={isBuffered ? "" : undefined} key={page}>
              <PageContent {...props} page={page} showDrawer={page === drawerPage} />
            </section>
          );
        })}
      </div>
    </div>
  );
}

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
  const isWideSpread = useWideSpread();

  const drawerItems = user
    ? [
        ...(user.role === "admin"
          ? [{ label: "admin.", onClick: onOpenAdmin }]
          : []),
        { label: "exit.", onClick: onLogout },
      ]
    : [];
  const pageProps = { user, onOpenSignIn, onLogout, onNotify, drawerItems };
  const currentPage = pageKeyForPath(location.pathname);
  const selectedPages = isWideSpread
    ? PAGE_ORDER.slice(currentPage === "travel" ? 1 : 0, (currentPage === "travel" ? 1 : 0) + 2)
    : [currentPage];

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

      <Navbar visible={showNav} selectedPages={selectedPages} />

      <main className="app-shell">
        {isWideSpread ? <MagazineSpread {...pageProps} /> : <MobileRoutes {...pageProps} />}
      </main>

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
