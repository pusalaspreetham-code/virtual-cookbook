import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;
  const close    = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={close}>
          <span className="brand-icon">⚑</span>
          <span className="brand-text">CookBook</span>
        </Link>
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/recipes"   className={isActive("/recipes")   ? "nav-link active" : "nav-link"} onClick={close}>Recipes</Link>
        {isLoggedIn && <>
          <Link to="/add-recipe"      className={isActive("/add-recipe")      ? "nav-link active" : "nav-link"} onClick={close}>Add Recipe</Link>
          <Link to="/favorites"       className={isActive("/favorites")       ? "nav-link active" : "nav-link"} onClick={close}>Favorites</Link>
          <Link to="/recommendations" className={isActive("/recommendations") ? "nav-link active" : "nav-link"} onClick={close}>For You</Link>
        </>}
        <Link to="/community" className={isActive("/community") ? "nav-link active" : "nav-link"} onClick={close}>Community</Link>
        <Link to="/support"   className={isActive("/support")   ? "nav-link active" : "nav-link"} onClick={close}>Support</Link>
      </div>

      <div className="navbar-actions">
        {isLoggedIn ? (
          <div className="user-menu">
            <div className="user-avatar" title={user?.name || "Me"}>
              {(user?.name || "U")[0].toUpperCase()}
            </div>
            <div className="user-dropdown">
              <Link to="/profile"  className="dropdown-item" onClick={close}>👤 Profile</Link>
              <Link to="/feedback" className="dropdown-item" onClick={close}>💬 Feedback</Link>
              <div className="dropdown-divider"/>
              <button onClick={handleLogout} className="dropdown-item danger">🚪 Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login"    className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
        <button className="hamburger" onClick={() => setMenuOpen(o=>!o)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </div>
    </nav>
  );
}
