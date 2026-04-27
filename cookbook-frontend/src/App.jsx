import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import SessionWarning from "./components/SessionWarning";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import AddRecipe from "./pages/AddRecipe";
import Favorites from "./pages/Favorites";
import Recommendations from "./pages/Recommendations";
import Community from "./pages/Community";
import Feedback from "./pages/Feedback";
import Support from "./pages/Support";
import Profile from "./pages/Profile";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location, message: "Please sign in to continue." }} replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <div className="app">
      <Navbar />
      <SessionWarning />
      <main className="main-content">
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/recipes"         element={<Recipes />} />
          <Route path="/community"       element={<Community />} />
          <Route path="/support"         element={<Support />} />
          <Route path="/add-recipe"      element={<PrivateRoute><AddRecipe /></PrivateRoute>} />
          <Route path="/favorites"       element={<PrivateRoute><Favorites /></PrivateRoute>} />
          <Route path="/recommendations" element={<PrivateRoute><Recommendations /></PrivateRoute>} />
          <Route path="/feedback"        element={<PrivateRoute><Feedback /></PrivateRoute>} />
          <Route path="/profile"         element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*"               element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
