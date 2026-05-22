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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-md bg-zinc-900/90 backdrop-blur-2xl shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight text-white">
            log-in.
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-zinc-400"
            >
              name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                id="username"
                type="text"
                placeholder="name-plz"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-600 border border-zinc-800 focus:border-zinc-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-400"
            >
              pass
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="and-psw"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 border border-zinc-800 focus:border-zinc-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 w-full bg-white py-2.5 text-sm font-bold text-black hover:bg-zinc-200 active:bg-zinc-400 transition-colors"
          >
            booom.
          </button>
        </form>

        {/* Footer */}
        {/* <div className="border-t border-zinc-800 px-6 py-4 text-center text-xs text-zinc-600">
          没有账号？联系管理员获取权限
        </div> */}
      </div>
    </div>
  );
}

export default SignInModal;
