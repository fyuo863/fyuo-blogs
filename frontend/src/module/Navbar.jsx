import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GithubIcon from "./GithubIcon";

function Navbar({ visible }) {
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

  const navigation = (
    <>
      <button className="site-nav__link" type="button" aria-current={location.pathname === "/" ? "page" : undefined} onClick={() => navigateTo("/")}>home.</button>
      <button className="site-nav__link" type="button" aria-current={location.pathname === "/blog" ? "page" : undefined} onClick={() => navigateTo("/blog")}>blogs.</button>
    </>
  );

  return (
    <header className={`site-nav transition-opacity duration-300 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <button className="site-wordmark" type="button" onClick={() => navigateTo("/")}>fyuo-blogs.</button>
      <nav className="site-nav__rail" aria-label="Primary navigation">{navigation}</nav>
      <div className="relative" ref={menuRef}>
        <button className="site-nav__menu" type="button" aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen((open) => !open)}>menu.</button>
        {menuOpen && <nav className="site-nav__sheet" id="site-menu" aria-label="Mobile navigation">{navigation}</nav>}
      </div>
      <a className="site-nav__github" href="https://github.com/fyuo863" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon size={20} /></a>
    </header>
  );
}

export default Navbar;
