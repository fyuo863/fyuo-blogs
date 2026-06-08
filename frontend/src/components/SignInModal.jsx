import { useState } from "react";
import { X, User, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "../api";

function SignInModal({ open, onClose, onLogin, onNotify }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("name and pass are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn(username.trim(), password);
      if (res.data?.data) {
        onLogin(res.data.data);
        onNotify?.({
          variant: "success",
          title: "logged-in.",
          message: "身份验证完成，可以继续管理文章。",
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "sign-in failed, try again.";
      setError(msg);
    } finally {
      setLoading(false);
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
          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 px-4 py-2.5">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-zinc-400">
              name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
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
            <label htmlFor="password" className="text-sm font-medium text-zinc-400">
              pass
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
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
            disabled={loading}
            className="mt-1 w-full bg-white py-2.5 text-sm font-bold text-black hover:bg-zinc-200 active:bg-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "wait..." : "booom."}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignInModal;
