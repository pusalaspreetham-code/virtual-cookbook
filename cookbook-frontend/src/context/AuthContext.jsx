import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [sessionWarning, setSessionWarning] = useState(false);
  // 23 hours in ms — warn 1 hr before 1-day token expires
  const WARNING_BEFORE_EXPIRY = 60 * 60 * 1000;

  const decodeToken = (tok) => {
    try { return JSON.parse(atob(tok.split(".")[1])); }
    catch { return null; }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setSessionWarning(false);
  }, []);

  useEffect(() => {
    if (!token) return;
    const payload = decodeToken(token);
    if (!payload) { logout(); return; }
    // Check expiry
    const expiresAt = payload.exp * 1000;
    if (Date.now() >= expiresAt) { logout(); return; }
    setUser(payload);
    // Schedule warning
    const warnIn = expiresAt - Date.now() - WARNING_BEFORE_EXPIRY;
    const expireIn = expiresAt - Date.now();
    const warnTimer   = warnIn > 0   ? setTimeout(() => setSessionWarning(true), warnIn)   : null;
    const expireTimer = expireIn > 0 ? setTimeout(() => logout(), expireIn) : null;
    return () => { clearTimeout(warnTimer); clearTimeout(expireTimer); };
  }, [token, logout]);

  const login = (tok) => {
    localStorage.setItem("token", tok);
    setToken(tok);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token, sessionWarning, setSessionWarning }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
