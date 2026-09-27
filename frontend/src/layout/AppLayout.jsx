import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "../module/Navbar";
import Footer from "../module/Footer";
import AppDrawer from "../components/AppDrawer";

import SignInModal from "../components/SignInModal";
import InfoModal from "../components/InfoModal";
import AdminPanel from "../components/AdminPanel";

import ContentDesk from "../pages/ContentDesk";
import PluginPage from "../components/PluginPage";

const PAGE_ORDER = ["home", "blog", "travel"];
const PAGE_PATHS = { home: "/", blog: "/blog", travel: "/travel", desk: "/desk" };

function pageKeyForPath(pathname) {
  pathname = pathname.replace(/\/$/, "") || "/";
  const aliases = { "/p/index": "home", "/p/journal": "blog", "/p/travel": "travel" };
  if (aliases[pathname]) return aliases[pathname];
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
  const location = useLocation();
  const parameters = new URLSearchParams(location.search);
  // A spread keeps multiple pages mounted. Only the addressed page may consume
  // a content-desk command; the other page keeps its state and normal routing.
  if (page !== pageKeyForPath(location.pathname) && parameters.has("desk")) {
    parameters.delete("desk");
    parameters.delete("id");
  }
  const pageLocation = { ...location, search: parameters.size ? `?${parameters}` : "" };
  const slug = { home: "index", blog: "journal", travel: "travel" }[page];
  return <Routes location={pageLocation}><Route path="*" element={<PluginPage slug={slug} user={user} onOpenSignIn={onOpenSignIn} onLogout={onLogout} onNotify={onNotify} drawerItems={drawerItems} showDrawer={showDrawer && Boolean(user)} portalTarget={document.getElementById("root")} />} /></Routes>;
}

function MobileRoutes(props) {
  const location = useLocation();
  if (["/", "/blog", "/travel", "/p/index", "/p/journal", "/p/travel"].includes(location.pathname.replace(/\/$/, "") || "/")) {
    return <section className="single-page-reader"><PageContent {...props} page={pageKeyForPath(location.pathname)} showDrawer /></section>;
  }
  return null;
}

function PluginRoute(props) {
  const location = useLocation();
  const slug = location.pathname.split("/")[2] || "";
  return <section className="single-page-reader"><PluginPage slug={decodeURIComponent(slug)} {...props} /></section>;
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
  const customPlugin = location.pathname.startsWith("/p/") && !["/p/index", "/p/journal", "/p/travel"].includes(location.pathname.replace(/\/$/, ""));
  const selectedPages = customPlugin ? [] : isWideSpread
    ? PAGE_ORDER.slice(currentPage === "travel" ? 1 : 0, (currentPage === "travel" ? 1 : 0) + 2)
    : [currentPage];

  return (
    <div className="app-frame">
      <Navbar visible selectedPages={selectedPages} />

      <main className="app-shell">
        {customPlugin ? <PluginRoute {...pageProps} /> : currentPage === "desk" ? <section className="single-page-reader"><ContentDesk user={user} onOpenSignIn={onOpenSignIn} /></section> : isWideSpread ? <MagazineSpread {...pageProps} /> : <MobileRoutes {...pageProps} />}
      </main>

      <Footer />

      {!user && <AppDrawer user={null} onOpenSignIn={onOpenSignIn} placement="frame" />}

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
    </div>
  );
}
