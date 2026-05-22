import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [username, setUsername] = useState(null);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold tracking-tight text-white hover:text-slate-200 transition-colors">
          全栈博客
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {username ? (
            <>
              <span className="text-slate-400">欢迎，{username}</span>
              <button
                onClick={() => setUsername(null)}
                className="rounded-md bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-500 transition-colors"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setUsername("Admin")}
                className="rounded-md bg-slate-800 px-3 py-1.5 font-medium text-white hover:bg-slate-700 transition-colors"
              >
                一键登录
              </button>
              <Link
                to="/signin"
                className="rounded-md border border-sky-500 px-3 py-1.5 font-medium text-sky-400 hover:bg-sky-500/10 transition-colors"
              >
                登录页
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
