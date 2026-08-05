import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../module/Navbar";
import Footer from "../module/Footer";
import AppDrawer from "../components/AppDrawer";

import SignInModal from "../components/SignInModal";
import InfoModal from "../components/InfoModal";
import AdminPanel from "../components/AdminPanel";

import Home from "../pages/Home";
import Blog from "../pages/Blog";
import Travel from "../pages/Travel";

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
    return <Home user={user} onOpenSignIn={onOpenSignIn} onLogout={onLogout} onNotify={onNotify} drawerItems={drawerItems} showDrawer={showDrawer && Boolean(user)} />;
  }

  if (page === "blog") {
    return <Blog user={user} onOpenSignIn={onOpenSignIn} onLogout={onLogout} onNotify={onNotify} drawerItems={drawerItems} showDrawer={showDrawer && Boolean(user)} />;
  }

  return <Travel user={user} onOpenSignIn={onOpenSignIn} onLogout={onLogout} onNotify={onNotify} />;
}

function MobileRoutes(props) {
  return (
    <Routes>
      <Route path="/" element={<section className="single-page-reader"><PageContent {...props} page="home" showDrawer /></section>} />
      <Route path="/blog" element={<section className="single-page-reader"><PageContent {...props} page="blog" showDrawer /></section>} />
      <Route path="/travel" element={<section className="single-page-reader"><PageContent {...props} page="travel" showDrawer={false} /></section>} />
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
    <div className="app-frame">
      <Navbar visible selectedPages={selectedPages} />

      <main className="app-shell">
        {isWideSpread ? <MagazineSpread {...pageProps} /> : <MobileRoutes {...pageProps} />}
        {!user && <AppDrawer user={null} onOpenSignIn={onOpenSignIn} placement="frame" />}
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
    </div>
  );
}
