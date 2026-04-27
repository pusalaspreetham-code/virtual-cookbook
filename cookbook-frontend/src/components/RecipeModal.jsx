import { useState, useEffect } from "react";
import { addFavorite, removeFavorite, getFavorites } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const CUISINE_COLORS = { Italian:"#e74c3c", Indian:"#f39c12", Chinese:"#27ae60", Mexican:"#8e44ad", American:"#2980b9", French:"#16a085", Japanese:"#c0392b", Thai:"#d35400" };
const CUISINE_EMOJI  = { Italian:"🍝", Indian:"🍛", Chinese:"🥢", Mexican:"🌮", American:"🍔", French:"🥐", Japanese:"🍱", Thai:"🍜" };

export default function RecipeModal({ recipe, onClose }) {
  const { isLoggedIn } = useAuth();
  const { addToast }   = useToast();
  const [isFav, setIsFav]             = useState(false);
  const [favLoading, setFavLoading]   = useState(false);
  const [checkingFav, setCheckingFav] = useState(true);
  const [activeStep, setActiveStep]   = useState(null);

  const accentColor = CUISINE_COLORS[recipe.cuisine] || "#6c5ce7";
  const emoji       = CUISINE_EMOJI[recipe.cuisine]  || "🍽";

  // Check if already in favorites when modal opens
  useEffect(() => {
    if (!isLoggedIn) { setCheckingFav(false); return; }
    getFavorites()
      .then(favs => {
        const already = favs.some(f => f.recipeId?._id === recipe._id || f.recipeId === recipe._id);
        setIsFav(already);
      })
      .catch(() => {})
      .finally(() => setCheckingFav(false));
  }, [recipe._id, isLoggedIn]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleFavorite = async () => {
    if (!isLoggedIn || favLoading || checkingFav) return;
    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavorite(recipe._id);
        setIsFav(false);
        addToast("Removed from favorites", "info");
      } else {
        await addFavorite(recipe._id);
        setIsFav(true);
        addToast("Saved to favorites! ♥", "success");
      }
    } catch (e) {
      addToast(e.message, "error");
    } finally {
      setFavLoading(false);
    }
  };

  const shareWhatsApp = () => {
    const text = `🍳 Check out this recipe: *${recipe.title}*\n⏱ ${recipe.cookingTime} mins | 🌍 ${recipe.cuisine}\n\nIngredients: ${recipe.ingredients?.join(", ")}\n\nShared from CookBook App 🍽`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" style={{"--accent": accentColor}}>

        <div className="modal-hero" style={{background: accentColor}}>
          <div className="modal-hero-emoji">{emoji}</div>
          <div className="modal-hero-content">
            <span className="modal-cuisine-tag">{recipe.cuisine || "Unknown"}</span>
            <h1 className="modal-title">{recipe.title}</h1>
            <div className="modal-meta-row">
              <span className="modal-meta-pill">⏱ {recipe.cookingTime} min</span>
              <span className="modal-meta-pill">🥗 {recipe.ingredients?.length} ingredients</span>
              <span className="modal-meta-pill">📋 {recipe.steps?.length} steps</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h2 className="modal-section-title">
              <span className="section-icon" style={{background: accentColor}}>🧂</span>
              Ingredients
            </h2>
            <div className="ingredients-grid">
              {recipe.ingredients?.map((ing, i) => (
                <div key={i} className="ingredient-item">
                  <span className="ingredient-dot" style={{background: accentColor}} />
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="modal-section">
            <h2 className="modal-section-title">
              <span className="section-icon" style={{background: accentColor}}>👨‍🍳</span>
              How to Make It
            </h2>
            <div className="steps-timeline">
              {recipe.steps?.map((step, i) => (
                <div key={i}
                  className={`step-item ${activeStep === i ? "step-active" : ""}`}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                  style={{"--step-color": accentColor}}
                >
                  <div className="step-number" style={{background: accentColor}}>{i + 1}</div>
                  <div className="step-content">
                    <div className="step-label">Step {i + 1}</div>
                    <p className="step-text">{step}</p>
                  </div>
                  {i < recipe.steps.length - 1 && (
                    <div className="step-connector" style={{background: accentColor}} />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="modal-footer">
          {isLoggedIn && (
            <button
              onClick={handleFavorite}
              disabled={favLoading || checkingFav}
              className={`btn ${isFav ? "btn-done" : "btn-primary"}`}
            >
              {checkingFav ? <span className="spinner"/> :
               favLoading  ? <span className="spinner"/> :
               isFav       ? "✓ Saved — click to remove" : "♥ Save to Favorites"}
            </button>
          )}
          <button onClick={shareWhatsApp} className="btn btn-whatsapp">
            📲 Share on WhatsApp
          </button>
          <button onClick={onClose} className="btn btn-ghost">Close</button>
        </div>
      </div>
    </div>
  );
}