import { useState, useEffect } from "react";
import { getRecommendations } from "../api/api";
import RecipeCard from "../components/RecipeCard";

export default function Recommendations() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendations()
      .then(setRecipes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">✦ For You</h1>
        <p className="page-subtitle">Recipes recommended based on your saved favorites</p>
      </div>

      {loading ? (
        <div className="loading-grid">
          {[...Array(4)].map((_,i)=><div key={i} className="skeleton-card"/>)}
        </div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽</div>
          <p>Save some recipes to your favorites first — we'll recommend similar ones here.</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map(r => <RecipeCard key={r._id} recipe={r}/>)}
        </div>
      )}
    </div>
  );
}
