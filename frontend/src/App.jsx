import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Travel from "./pages/Travel";
import Navbar from "./module/Navbar";
import Footer from "./module/Footer";
import SignInModal from "./components/SignInModal";
import InfoModal from "./components/InfoModal";
import AdminPanel from "./components/AdminPanel";

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

  return <Travel />;
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
  const pageKeys = PAGE_ORDER;
  const spreadStart = pageKeyForPath(location.pathname) === "travel" ? 1 : 0;
  const visibleKeys = pageKeys.slice(spreadStart, spreadStart + 2);
  const drawerPage = visibleKeys.includes("blog") ? "blog" : visibleKeys.includes("home") ? "home" : null;

  return (
    <div className="magazine-spread" aria-label="Two-page magazine reader">
      <div className="magazine-spread__track" style={{ "--spread-offset": `${spreadStart * -33.333333}%` }}>
        {pageKeys.map((page, index) => (
          <section className={`magazine-spread__page${index < spreadStart || index > spreadStart + 1 ? " is-buffer" : ""}`} aria-label={`${page} page`} aria-hidden={index < spreadStart || index > spreadStart + 1} inert={index < spreadStart || index > spreadStart + 1 ? "" : undefined} key={page}>
            <PageContent {...props} page={page} showDrawer={page === drawerPage} />
          </section>
        ))}
      </div>
    </div>
  );
}

function AppLayout({ user, showSignIn, showAdmin, onOpenAdmin, onCloseAdmin, onOpenSignIn, onCloseSignIn, onLogin, onLogout, onNotify }) {
  const drawerItems = user
    ? [...(user.role === "admin" ? [{ label: "admin.", onClick: onOpenAdmin }] : []), { label: "exit.", onClick: onLogout }]
    : [];
  const isWideSpread = useWideSpread();
  const location = useLocation();
  const pageProps = { user, onOpenSignIn, onLogout, onNotify, drawerItems };
  const currentPage = pageKeyForPath(location.pathname);
  const selectedPages = isWideSpread
    ? PAGE_ORDER.slice(currentPage === "travel" ? 1 : 0, (currentPage === "travel" ? 1 : 0) + 2)
    : [currentPage];

  return (
    <>
      <Navbar visible selectedPages={selectedPages} />
      <main className="app-shell">
        {isWideSpread ? <MagazineSpread {...pageProps} /> : <MobileRoutes {...pageProps} />}
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
