import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GithubIcon from "./GithubIcon";

function Navbar({ visible, selectedPages = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnOutsidePress = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, []);

  const navigateTo = (path) => {
    setMenuOpen(false);
    if (path !== location.pathname) navigate(path);
  };
  const isSelected = (page) => selectedPages.includes(page);

  const navigation = (
    <>
      <button className="site-nav__link" type="button" data-selected={isSelected("home") || undefined} aria-current={location.pathname === "/" ? "page" : undefined} onClick={() => navigateTo("/")}>index</button>
      <button className="site-nav__link" type="button" data-selected={isSelected("blog") || undefined} aria-current={location.pathname === "/blog" ? "page" : undefined} onClick={() => navigateTo("/blog")}>journal</button>
      <button className="site-nav__link" type="button" data-selected={isSelected("travel") || undefined} aria-current={location.pathname === "/travel" ? "page" : undefined} onClick={() => navigateTo("/travel")}>travel</button>
    </>
  );

  return (
    <header className={`site-nav transition-opacity duration-300 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <span className="site-nav__edition">fyuo<sub className="brand-subscript">863</sub> / 2026</span>
      <button className="site-wordmark" type="button" onClick={() => navigateTo("/")}>FYUO<sub className="brand-subscript">863</sub></button>
      <div className="site-nav__actions">
        <nav className="site-nav__rail" aria-label="Primary navigation">{navigation}</nav>
        <div className="relative" ref={menuRef}>
          <button className="site-nav__menu" type="button" aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen((open) => !open)}>menu</button>
          {menuOpen && <nav className="site-nav__sheet" id="site-menu" aria-label="Mobile navigation">{navigation}</nav>}
        </div>
        <a className="site-nav__github" href="https://github.com/fyuo863" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon size={20} /></a>
      </div>
    </header>
  );
}

export default Navbar;
