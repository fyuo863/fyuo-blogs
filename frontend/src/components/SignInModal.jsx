import { useState } from "react";
import { X, User, Lock, Eye, EyeOff } from "lucide-react";

function SignInModal({ open, onClose, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username.trim());
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            登录
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-300"
            >
              用户名
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-700/50 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-300"
            >
              密码
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700/50 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 active:bg-sky-600 transition-colors"
          >
            登 录
          </button>
        </form>

        {/* Footer */}
        <div className="border-t border-slate-700/50 px-6 py-4 text-center text-xs text-slate-500">
          没有账号？联系管理员获取权限
        </div>
      </div>
    </div>
  );
}

export default SignInModal;
