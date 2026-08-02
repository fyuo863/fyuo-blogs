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
          <span>FYUO<sub>863</sub></span>
          <strong>EDITOR<br />ACCESS</strong>
          <i />
        </aside>
        <div className="sign-in-modal__body">
          <header className="sign-in-modal__header">
            <div>
              <p>PRIVATE DESK / 01</p>
              <h2 id="sign-in-title">log-in.</h2>
            </div>
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

          <footer className="sign-in-modal__footer">
            <span>FYUO<sub>863</sub> / PRIVATE MODE</span>
            <span aria-live="polite">{loading ? "PLEASE WAIT" : "READY"}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default SignInModal;
