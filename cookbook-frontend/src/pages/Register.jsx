import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import { useToast } from "../context/ToastContext";

const getStrength = (p) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};
const LABELS = ["","Weak","Fair","Good","Strong"];
const COLORS = { 1:"#ef4444", 2:"#f59e0b", 3:"#3b82f6", 4:"#22c55e" };

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const strength = getStrength(form.password);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords don't match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError(""); setLoading(true);
    try {
      await registerUser({ name:form.name, email:form.email, password:form.password });
      addToast("Account created! Please sign in.", "success");
      navigate("/login");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-deco" style={{background:"#2d6a4f"}}>
        <div className="deco-big">🥘</div>
        <div className="deco-words">
          <span>sauté</span><span>braise</span><span>grill</span>
          <span>bake</span><span>roast</span><span>poach</span>
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-logo">⚑ CookBook</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join thousands of home chefs</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Gordon Ramsay" required autoComplete="name"/>
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="chef@kitchen.com" required autoComplete="email"/>
          </div>
          <div className="field">
            <label>Password</label>
            <div className="input-wrapper">
              <input type={showPass?"text":"password"} name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required autoComplete="new-password"/>
              <button type="button" className="input-eye" onClick={()=>setShowPass(s=>!s)}>{showPass?"🙈":"👁"}</button>
            </div>
            {form.password && (
              <div style={{display:"flex",alignItems:"center",gap:".7rem",marginTop:".4rem"}}>
                <div style={{flex:1,height:"4px",background:"var(--border)",borderRadius:"2px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${strength*25}%`,background:COLORS[strength]||"var(--border)",borderRadius:"2px",transition:"all .3s"}}/>
                </div>
                <span style={{fontSize:".78rem",fontWeight:600,color:COLORS[strength],whiteSpace:"nowrap"}}>{LABELS[strength]}</span>
              </div>
            )}
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type={showPass?"text":"password"} name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repeat password" required autoComplete="new-password"/>
            {form.confirm && form.confirm !== form.password && <span className="field-error">Passwords don't match</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner"/> : "Create Account"}
          </button>
        </form>
        <div className="auth-divider"><span>or</span></div>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
