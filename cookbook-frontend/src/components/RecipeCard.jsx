import { useState } from "react";
import { deleteRecipe } from "../api/api";
import RecipeModal from "./RecipeModal";

const CUISINE_COLORS = {
  Italian:"#e74c3c", Indian:"#f39c12", Chinese:"#27ae60",
  Mexican:"#8e44ad", American:"#2980b9", French:"#16a085",
  Japanese:"#c0392b", Thai:"#d35400",
};

export default function RecipeCard({ recipe, onDelete, showActions = false }) {
  const [showModal, setShowModal] = useState(false);
  const accentColor = CUISINE_COLORS[recipe.cuisine] || "#6c5ce7";

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this recipe?")) return;
    try { await deleteRecipe(recipe._id); onDelete?.(recipe._id); }
    catch (e) { alert(e.message); }
  };

  return (
    <>
      <div className="recipe-card" style={{"--accent":accentColor}}
        onClick={() => setShowModal(true)} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}>
        <div className="card-accent-bar" style={{background: accentColor}} />
        <div className="card-body">
          <div className="card-header-row">
            <h3 className="card-title">{recipe.title}</h3>
            <span className="cuisine-badge" style={{background: accentColor}}>{recipe.cuisine || "—"}</span>
          </div>
          <div className="card-meta">
            <span className="meta-item"><span className="meta-icon">⏱</span>{recipe.cookingTime} min</span>
            <span className="meta-item"><span className="meta-icon">🥗</span>{recipe.ingredients?.length} ingredients</span>
          </div>
          <div className="ingredients-preview">
            {recipe.ingredients?.slice(0,4).map((ing,i) => <span key={i} className="ingredient-tag">{ing}</span>)}
            {recipe.ingredients?.length > 4 && <span className="ingredient-tag more">+{recipe.ingredients.length-4}</span>}
          </div>
          <div className="card-actions">
            <span className="view-recipe-hint">Tap to view full recipe →</span>
            {showActions && onDelete && (
              <button onClick={handleDelete} className="btn btn-sm btn-danger">Delete</button>
            )}
          </div>
        </div>
      </div>
      {showModal && <RecipeModal recipe={recipe} onClose={() => setShowModal(false)} />}
    </>
  );
}
