import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, changePassword, deleteAccount } from "../api/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab]         = useState("info");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  // Info tab
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");

  // Security tab
  const [pwForm, setPwForm] = useState({ current:"", newPw:"", confirm:"" });
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    getProfile()
      .then(data => { setName(data.name || ""); setEmail(data.email || ""); })
      .catch(e   => addToast(e.message, "error"))
      .finally(()=> setLoading(false));
  }, []);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!name.trim()) { addToast("Name cannot be empty", "warning"); return; }
    setSaving(true);
    try {
      await updateProfile({ name, email });
      addToast("Profile updated successfully ✅", "success");
    } catch (e) {
      addToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { addToast("New passwords don't match", "error"); return; }
    if (pwForm.newPw.length < 6) { addToast("Password must be at least 6 characters", "warning"); return; }
    setSaving(true);
    try {
      await changePassword({ currentPassword: pwForm.current, newPassword: pwForm.newPw });
      addToast("Password changed successfully ✅", "success");
      setPwForm({ current:"", newPw:"", confirm:"" });
    } catch (e) {
      addToast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "⚠️ This will permanently delete your account, all your recipes, and favorites.\n\nThis CANNOT be undone. Are you absolutely sure?"
    );
    if (!confirmed) return;
    const doubleConfirm = window.confirm("Last warning: are you sure you want to delete your account?");
    if (!doubleConfirm) return;
    try {
      await deleteAccount();
      logout();
      addToast("Account deleted.", "info");
      navigate("/");
    } catch (e) {
      addToast(e.message, "error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return (
    <div className="page page-narrow">
      <div className="loading-grid">
        {[...Array(3)].map((_,i)=><div key={i} className="skeleton-card" style={{height:"80px"}}/>)}
      </div>
    </div>
  );

  return (
    <div className="page page-narrow">
      <div className="profile-header">
        <div className="profile-avatar-lg">{(name || "U")[0].toUpperCase()}</div>
        <div>
          <h1 className="page-title">{name || "Chef"}</h1>
          <p className="page-subtitle">{email}</p>
        </div>
      </div>

      <div className="profile-tabs">
        {[["info","👤 Info"],["security","🔒 Password"],["danger","⚠️ Account"]].map(([t,label]) => (
          <button key={t} className={`profile-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
            {label}
          </button>
        ))}
      </div>

      {/* INFO TAB */}
      {tab === "info" && (
        <form className="form-section" onSubmit={handleUpdateInfo}>
          <h2 className="section-title">Profile Information</h2>
          <div className="field">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Your name"
            />
          </div>
          <div className="field" style={{marginTop:"1rem"}}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <div style={{marginTop:"1.5rem"}}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner"/> Saving...</> : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* PASSWORD TAB */}
      {tab === "security" && (
        <form className="form-section" onSubmit={handleChangePassword}>
          <h2 className="section-title">Change Password</h2>
          <div className="field">
            <label>Current Password</label>
            <div className="input-wrapper">
              <input
                type={showPw ? "text" : "password"}
                value={pwForm.current}
                onChange={e => setPwForm({...pwForm, current:e.target.value})}
                required
                placeholder="Your current password"
              />
              <button type="button" className="input-eye" onClick={()=>setShowPw(s=>!s)}>
                {showPw?"🙈":"👁"}
              </button>
            </div>
          </div>
          <div className="field" style={{marginTop:"1rem"}}>
            <label>New Password</label>
            <input
              type={showPw ? "text" : "password"}
              value={pwForm.newPw}
              onChange={e => setPwForm({...pwForm, newPw:e.target.value})}
              required
              placeholder="Minimum 6 characters"
            />
          </div>
          <div className="field" style={{marginTop:"1rem"}}>
            <label>Confirm New Password</label>
            <input
              type={showPw ? "text" : "password"}
              value={pwForm.confirm}
              onChange={e => setPwForm({...pwForm, confirm:e.target.value})}
              required
              placeholder="Repeat new password"
            />
            {pwForm.confirm && pwForm.confirm !== pwForm.newPw && (
              <span className="field-error">Passwords don't match</span>
            )}
          </div>
          <div style={{marginTop:"1.5rem"}}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner"/> Updating...</> : "Update Password"}
            </button>
          </div>
        </form>
      )}

      {/* DANGER TAB */}
      {tab === "danger" && (
        <div className="form-section danger-zone">
          <h2 className="section-title">Account Actions</h2>
          <div className="danger-action">
            <div>
              <strong>Log Out</strong>
              <p>Sign out of your current session.</p>
            </div>
            <button className="btn btn-outline" onClick={handleLogout}>Log Out</button>
          </div>
          <div className="danger-action">
            <div>
              <strong>Delete Account</strong>
              <p>Permanently remove your account, recipes, and all data. This cannot be undone.</p>
            </div>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
      )}
    </div>
  );
}
