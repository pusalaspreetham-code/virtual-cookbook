import { useState, useEffect } from "react";
import { getAllRecipes, searchRecipes } from "../api/api";
import RecipeCard from "../components/RecipeCard";

const CUISINES = ["All","Italian","Indian","Chinese","Mexican","American","French","Japanese","Thai","Mediterranean"];

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [filters, setFilters] = useState({ ingredient:"", cuisine:"", maxTime:"" });

  useEffect(() => { loadRecipes(); }, []);

  const loadRecipes = async () => {
    setLoading(true);
    try { const data = await getAllRecipes(); setRecipes(data); setSearchMode(false); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const params = {};
    if (filters.ingredient) params.ingredient = filters.ingredient;
    if (filters.cuisine && filters.cuisine !== "All") params.cuisine = filters.cuisine;
    if (filters.maxTime) params.maxTime = filters.maxTime;
    if (!Object.keys(params).length) return loadRecipes();
    setLoading(true);
    try { const data = await searchRecipes(params); setRecipes(data); setSearchMode(true); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">All Recipes</h1>
        <p className="page-subtitle">{recipes.length} recipes in the kitchen</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-fields">
          <div className="field">
            <label>Ingredient</label>
            <input type="text" placeholder="e.g. chicken" value={filters.ingredient} onChange={e=>setFilters({...filters,ingredient:e.target.value})} />
          </div>
          <div className="field">
            <label>Cuisine</label>
            <select value={filters.cuisine} onChange={e=>setFilters({...filters,cuisine:e.target.value})}>
              {CUISINES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Max Time (min)</label>
            <input type="number" placeholder="e.g. 30" value={filters.maxTime} onChange={e=>setFilters({...filters,maxTime:e.target.value})} min={1} />
          </div>
          <div className="search-actions">
            <button type="submit" className="btn btn-primary">Search</button>
            {searchMode && <button type="button" className="btn btn-ghost" onClick={loadRecipes}>Clear</button>}
          </div>
        </div>
      </form>

      {loading ? (
        <div className="loading-grid">{[...Array(6)].map((_,i)=><div key={i} className="skeleton-card"/>)}</div>
      ) : recipes.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🔍</div><p>No recipes found. Try different filters.</p></div>
      ) : (
        <div className="recipe-grid">{recipes.map(r=><RecipeCard key={r._id} recipe={r}/>)}</div>
      )}
    </div>
  );
}
