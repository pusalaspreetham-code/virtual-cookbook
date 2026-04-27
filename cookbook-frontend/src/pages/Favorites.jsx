import { useState, useEffect } from "react";
import { getFavorites } from "../api/api";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getFavorites().then(data=>setFavorites(data.filter(f=>f.recipeId))).catch(console.error).finally(()=>setLoading(false));
  }, []);
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">♥ My Favorites</h1>
        <p className="page-subtitle">{favorites.length} saved recipes</p>
      </div>
      {loading ? <div className="loading-grid">{[...Array(4)].map((_,i)=><div key={i} className="skeleton-card"/>)}</div>
        : favorites.length === 0 ? <div className="empty-state"><div className="empty-icon">♡</div><p>No favorites yet. Browse recipes and save some!</p></div>
        : <div className="recipe-grid">{favorites.map(f=><RecipeCard key={f._id} recipe={f.recipeId}/>)}</div>}
    </div>
  );
}
