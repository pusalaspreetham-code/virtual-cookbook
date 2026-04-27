import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../api/api";
import { useToast } from "../context/ToastContext";
import useUnsavedWarning from "../hooks/useUnsavedWarning";

const CUISINES = ["Italian","Indian","Chinese","Mexican","American","French","Japanese","Thai","Mediterranean","Greek","Other"];

const empty = { title:"", cuisine:"Italian", cookingTime:"", ingredients:[""], steps:[""] };

export default function AddRecipe() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState(empty);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useUnsavedWarning(isDirty);

  const mark = (updates) => { setForm(f=>({...f,...updates})); setIsDirty(true); };
  const updateList = (field, index, value) => { const u=[...form[field]]; u[index]=value; mark({[field]:u}); };
  const addItem = (field) => mark({[field]:[...form[field],""]});
  const removeItem = (field, index) => { if(form[field].length===1)return; mark({[field]:form[field].filter((_,i)=>i!==index)}); };

  const handleCancel = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) return;
    navigate("/recipes");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const cleanIng  = form.ingredients.filter(i=>i.trim());
    const cleanStep = form.steps.filter(s=>s.trim());
    if (!cleanIng.length || !cleanStep.length) { setError("Add at least one ingredient and one step."); return; }
    setLoading(true);
    try {
      await addRecipe({...form, ingredients:cleanIng, steps:cleanStep});
      setIsDirty(false);
      addToast("Recipe published! 🎉", "success");
      navigate("/recipes");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <h1 className="page-title">Add New Recipe</h1>
        <p className="page-subtitle">Share your creation with the world</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {isDirty && <div className="alert alert-warning" style={{marginBottom:"1.5rem"}}>⚠️ You have unsaved changes</div>}

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-section">
          <h2 className="section-title">Basic Info</h2>
          <div className="form-row">
            <div className="field flex-2">
              <label>Recipe Title *</label>
              <input type="text" value={form.title} onChange={e=>mark({title:e.target.value})} placeholder="e.g. Creamy Chicken Pasta" required />
            </div>
            <div className="field">
              <label>Cuisine</label>
              <select value={form.cuisine} onChange={e=>mark({cuisine:e.target.value})}>
                {CUISINES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Cook Time (min) *</label>
              <input type="number" value={form.cookingTime} onChange={e=>mark({cookingTime:e.target.value})} placeholder="30" required min={1} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Ingredients</h2>
          <div className="dynamic-list">
            {form.ingredients.map((ing,i) => (
              <div key={i} className="list-row">
                <input type="text" value={ing} onChange={e=>updateList("ingredients",i,e.target.value)} placeholder={`Ingredient ${i+1}`} />
                <button type="button" className="icon-btn remove" onClick={()=>removeItem("ingredients",i)}>✕</button>
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={()=>addItem("ingredients")}>+ Add Ingredient</button>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Steps</h2>
          <div className="dynamic-list">
            {form.steps.map((step,i) => (
              <div key={i} className="list-row">
                <span className="step-num">{i+1}</span>
                <textarea value={step} onChange={e=>updateList("steps",i,e.target.value)} placeholder={`Step ${i+1}...`} rows={2} />
                <button type="button" className="icon-btn remove" onClick={()=>removeItem("steps",i)}>✕</button>
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={()=>addItem("steps")}>+ Add Step</button>
          </div>
        </div>

        <div className="form-submit">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <span className="spinner" /> : "Publish Recipe"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
