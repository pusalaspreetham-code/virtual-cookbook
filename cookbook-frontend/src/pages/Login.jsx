import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [form, setForm]       = useState({ email:"", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const { addToast } = useToast();
  const navigate    = useNavigate();
  const location    = useLocation();
  const from        = location.state?.from?.pathname || "/recipes";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data.token);
      addToast("Welcome back! 👨‍🍳", "success");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-deco">
        <div className="deco-big">🍳</div>
        <div className="deco-words">
          <span>risotto</span><span>ramen</span><span>tacos</span>
          <span>biryani</span><span>pasta</span><span>curry</span>
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-logo">⚑ CookBook</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your kitchen</p>

        {location.state?.message && (
          <div className="alert alert-warning">{location.state.message}</div>
        )}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email" name="email"
              value={form.email}
              onChange={e => setForm({...form, email:e.target.value})}
              placeholder="chef@kitchen.com"
              required autoComplete="email"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPass ? "text" : "password"} name="password"
                value={form.password}
                onChange={e => setForm({...form, password:e.target.value})}
                placeholder="••••••••"
                required autoComplete="current-password"
              />
              <button type="button" className="input-eye" onClick={() => setShowPass(s=>!s)}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner"/> : "Sign In"}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>
        <p className="auth-switch">No account? <Link to="/register">Sign up free</Link></p>
      </div>
    </div>
  );
}
