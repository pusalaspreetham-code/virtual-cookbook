import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SessionWarning() {
  const { sessionWarning, setSessionWarning, logout } = useAuth();
  const navigate = useNavigate();

  if (!sessionWarning) return null;

  const handleStay = () => setSessionWarning(false);
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="session-overlay">
      <div className="session-modal">
        <div className="session-icon">⏰</div>
        <h2>Your session is expiring soon</h2>
        <p>You'll be automatically logged out in less than an hour. Do you want to stay signed in?</p>
        <div className="session-actions">
          <button onClick={handleStay} className="btn btn-primary">Stay Signed In</button>
          <button onClick={handleLogout} className="btn btn-ghost">Log Out Now</button>
        </div>
      </div>
    </div>
  );
}
