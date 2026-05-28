import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GithubIcon from "./GithubIcon";

function Navbar({ visible }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const homeRef = useRef(null);
  const blogsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeEl = isHome ? homeRef.current : blogsRef.current;
    if (!activeEl) return;
    const { offsetLeft, offsetWidth } = activeEl;
    const barWidth = offsetWidth * 0.6;
    const barLeft = offsetLeft + (offsetWidth - barWidth) / 2;
    setIndicatorStyle({ left: barLeft, width: barWidth });
  }, [isHome]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[110] px-4 py-6 sm:px-6 lg:px-8 transition-opacity duration-500 ease-out ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 模糊层 — mask 渐变从上到下由实到虚 */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
        }}
      />

      {/* 颜色渐变层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />

      {/* 内容 */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate("/")}
            className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors italic"
          >
            fyuo-blogs.
          </button>
          <nav className="relative hidden sm:flex items-center gap-6">
            <button
              ref={homeRef}
              onClick={() => navigate("/")}
              className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
            >
              home.
            </button>
            <button
              ref={blogsRef}
              onClick={() => navigate("/blog")}
              className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
            >
              blogs.
            </button>

            {/* 滑动指示条 */}
            <div
              className="absolute -bottom-1 h-[3px] bg-white transition-all duration-300 ease-out"
              style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            />
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
    </div>
  );
}

export default Navbar;
