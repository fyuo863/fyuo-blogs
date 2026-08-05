import { useEffect, useRef, useState } from "react";
import { X, User, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "../api";

function LoginHalftoneField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !surface || !context) return undefined;

    const draw = () => {
      const bounds = surface.getBoundingClientRect();
      const rootStyles = getComputedStyle(document.documentElement);
      const cellSize = Number.parseFloat(rootStyles.getPropertyValue("--halftone-cell-size")) || 18;
      const baseRadius = Number.parseFloat(rootStyles.getPropertyValue("--halftone-base-radius")) || 0.78;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const paper = rootStyles.getPropertyValue("--color-paper").trim();

      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = paper;

      for (let y = cellSize / 2; y < height + cellSize; y += cellSize) {
        for (let x = cellSize / 2; x < width + cellSize; x += cellSize) {
          const towardDivider = Math.max(0, Math.min(1, x / width));
          const radius = cellSize * baseRadius * Math.pow(towardDivider, 1.45);
          if (radius < 0.35) continue;
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    const observer = new ResizeObserver(draw);
    observer.observe(surface);
    draw();
    return () => observer.disconnect();
  }, []);

  return <canvas ref={canvasRef} className="sign-in-modal__halftone" aria-hidden="true" />;
}

function SignInModal({ open, onClose, onLogin, onNotify }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      const msg = err.response?.data?.error || err.response?.data?.message || "sign-in failed, try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="sign-in-modal" onClick={handleOverlayClick}>
      <div className="sign-in-modal__panel" role="dialog" aria-modal="true" aria-labelledby="sign-in-title">
        <aside className="sign-in-modal__masthead" aria-hidden="true">
          <LoginHalftoneField />
        </aside>
        <div className="sign-in-modal__body">
          <header className="sign-in-modal__header">
            <h2 id="sign-in-title">log-in.</h2>
            <button type="button" onClick={onClose} className="sign-in-modal__close" aria-label="关闭登录窗口">
              <X size={19} strokeWidth={2.5} />
            </button>
          </header>

          <form onSubmit={handleSubmit} className="sign-in-modal__form">
            {error && (
              <div className="sign-in-modal__error" id="sign-in-error" role="alert">
                <span>ACCESS DENIED</span>
                <p>{error}</p>
              </div>
            )}

            <label className="sign-in-modal__field" htmlFor="username">
              <span>IDENTITY / NAME</span>
              <span className="sign-in-modal__input-wrap">
                <User size={16} aria-hidden="true" />
                <input id="username" type="text" placeholder="name-plz" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" aria-invalid={error ? "true" : undefined} aria-describedby={error ? "sign-in-error" : undefined} />
              </span>
            </label>

            <label className="sign-in-modal__field" htmlFor="password">
              <span>AUTHORIZATION / PASS</span>
              <span className="sign-in-modal__input-wrap">
                <Lock size={16} aria-hidden="true" />
                <input id="password" type={showPassword ? "text" : "password"} placeholder="and-psw" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" aria-invalid={error ? "true" : undefined} aria-describedby={error ? "sign-in-error" : undefined} />
                <button type="button" className="sign-in-modal__visibility" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "隐藏密码" : "显示密码"}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            <button type="submit" disabled={loading} className="sign-in-modal__submit">
              <span>{loading ? "AUTHENTICATING" : "UNLOCK THE DESK"}</span>
              <b aria-hidden="true">↗</b>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInModal;
