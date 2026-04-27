import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call — wire to real endpoint when backend supports it
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-deco" style={{background:"#7c3aed"}}>
        <div className="deco-big">🔑</div>
        <div className="deco-words">
          <span>reset</span><span>secure</span><span>verify</span>
          <span>recover</span><span>access</span><span>restore</span>
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-logo">⚑ CookBook</div>
        {!sent ? (
          <>
            <h1 className="auth-title">Forgot password?</h1>
            <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="auth-form" style={{marginTop:"1.5rem"}}>
              <div className="field">
                <label>Email address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="chef@kitchen.com" required autoFocus />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <span className="spinner" /> : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="forgot-success">
            <div className="forgot-icon">📬</div>
            <h2>Check your inbox!</h2>
            <p>We've sent a password reset link to <strong>{email}</strong>. Check your spam folder if you don't see it.</p>
          </div>
        )}
        <p className="auth-switch" style={{marginTop:"2rem"}}><Link to="/login">← Back to Sign In</Link></p>
      </div>
    </div>
  );
}
