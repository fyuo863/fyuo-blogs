import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

const icons = {
  info: Info,
  success: CheckCircle2,
  error: AlertTriangle,
};

function InfoModal({ open, title, message, variant = "info", onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [open, title, message, variant, onClose]);

  const Icon = icons[variant] || Info;
  const tone =
    variant === "error"
      ? "text-red-400 border-red-500/30 bg-red-500/10"
      : variant === "success"
        ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
        : "text-white border-zinc-700 bg-white/5";

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[130] flex justify-center px-4 pt-4 sm:px-6 lg:px-8"
      aria-live="polite"
    >
      <div
        className={`pointer-events-auto w-full max-w-xl border border-zinc-800 bg-zinc-950/95 shadow-2xl shadow-black/50
          transition-all duration-500 ease-out ${
            open ? "translate-y-0 opacity-100" : "-translate-y-28 opacity-0"
          }`}
      >
        <div className="flex items-start gap-4 px-5 py-4">
          <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border ${tone}`}>
            <Icon size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold tracking-tight text-white">
              {title}
            </h2>
            {message && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                {message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1.5 text-zinc-500 transition-colors hover:text-white"
            aria-label="close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoModal;
