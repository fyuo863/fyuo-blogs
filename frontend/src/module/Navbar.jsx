import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GithubIcon from "./GithubIcon";

function Navbar({ visible }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const homeRef = useRef(null);
  const blogsRef = useRef(null);
  const menuRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeEl = isHome ? homeRef.current : blogsRef.current;
    if (!activeEl) return;
    const { offsetLeft, offsetWidth } = activeEl;
    const barWidth = offsetWidth * 0.6;
    const barLeft = offsetLeft + (offsetWidth - barWidth) / 2;
    setIndicatorStyle({ left: barLeft, width: barWidth });
  }, [isHome]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[110] px-4 py-6 sm:px-6 lg:px-8 transition-opacity duration-500 ease-out ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />

      <div className="relative flex items-center justify-between">
        {/* 左侧：fyuo-blogs. */}
        <button
          onClick={() => handleNav("/")}
          className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors italic shrink-0"
        >
          fyuo-blogs.
        </button>

        {/* 中间：导航栏（宽屏）或 menu. 下拉（窄屏） */}
        <div className="absolute left-1/2 -translate-x-1/2">
          {/* 宽屏：直接显示导航 */}
          <nav className="hidden md:flex relative items-center gap-6">
            <button
              ref={homeRef}
              onClick={() => handleNav("/")}
              className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
            >
              home.
            </button>
            <button
              ref={blogsRef}
              onClick={() => handleNav("/blog")}
              className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
            >
              blogs.
            </button>
            <div
              className="absolute -bottom-1 h-[3px] bg-white transition-all duration-300 ease-out"
              style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            />
          </nav>

          {/* 窄屏：menu. 按钮 + 下拉 */}
          <div className="md:hidden relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
            >
              menu.
            </button>
            {menuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-zinc-900 border border-zinc-700 shadow-2xl py-2 px-6 flex flex-col items-center gap-2 min-w-[120px]">
                <button
                  onClick={() => handleNav("/")}
                  className={`text-lg font-bold tracking-tight transition-colors ${
                    isHome ? "text-white" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  home.
                </button>
                <button
                  onClick={() => handleNav("/blog")}
                  className={`text-lg font-bold tracking-tight transition-colors ${
                    !isHome ? "text-white" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  blogs.
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：GitHub 图标（始终显示） */}
        <a
          href="https://github.com/fyuo863"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-colors shrink-0"
        >
          <GithubIcon size={20} />
        </a>
      </div>
    </div>
  );
}

export default Navbar;
