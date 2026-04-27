const BASE_URL = "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// ── AUTH ──────────────────────────────────────────────────────────
export const registerUser = (body) =>
  fetch(`${BASE_URL}/register`, { method:"POST", headers:getHeaders(), body:JSON.stringify(body) }).then(handle);

export const loginUser = (body) =>
  fetch(`${BASE_URL}/login`, { method:"POST", headers:getHeaders(), body:JSON.stringify(body) }).then(handle);

// ── PROFILE ───────────────────────────────────────────────────────
export const getProfile = () =>
  fetch(`${BASE_URL}/profile`, { headers:getHeaders() }).then(handle);

export const updateProfile = (body) =>
  fetch(`${BASE_URL}/profile`, { method:"PUT", headers:getHeaders(), body:JSON.stringify(body) }).then(handle);

export const changePassword = (body) =>
  fetch(`${BASE_URL}/change-password`, { method:"PUT", headers:getHeaders(), body:JSON.stringify(body) }).then(handle);

export const deleteAccount = () =>
  fetch(`${BASE_URL}/delete-account`, { method:"DELETE", headers:getHeaders() }).then(handle);

// ── RECIPES ───────────────────────────────────────────────────────
export const getAllRecipes = () =>
  fetch(`${BASE_URL}/recipes`, { headers:getHeaders() }).then(handle);

export const addRecipe = (body) =>
  fetch(`${BASE_URL}/add-recipe`, { method:"POST", headers:getHeaders(), body:JSON.stringify(body) }).then(handle);

export const updateRecipe = (id, body) =>
  fetch(`${BASE_URL}/recipe/${id}`, { method:"PUT", headers:getHeaders(), body:JSON.stringify(body) }).then(handle);

export const deleteRecipe = (id) =>
  fetch(`${BASE_URL}/recipe/${id}`, { method:"DELETE", headers:getHeaders() }).then(handle);

export const searchRecipes = (params) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${BASE_URL}/advanced-search?${query}`, { headers:getHeaders() }).then(handle);
};

export const getRecommendations = () =>
  fetch(`${BASE_URL}/recommendations`, { headers:getHeaders() }).then(handle);

// ── FAVORITES ─────────────────────────────────────────────────────
export const addFavorite = (recipeId) =>
  fetch(`${BASE_URL}/favorite`, { method:"POST", headers:getHeaders(), body:JSON.stringify({ recipeId }) }).then(handle);

export const removeFavorite = (recipeId) =>
  fetch(`${BASE_URL}/favorite/${recipeId}`, { method:"DELETE", headers:getHeaders() }).then(handle);

export const getFavorites = () =>
  fetch(`${BASE_URL}/favorites`, { headers:getHeaders() }).then(handle);

// ── COMMUNITY ─────────────────────────────────────────────────────
export const getCommunityPosts = () =>
  fetch(`${BASE_URL}/community`, { headers:getHeaders() }).then(handle);

export const createPost = (body) =>
  fetch(`${BASE_URL}/community`, { method:"POST", headers:getHeaders(), body:JSON.stringify(body) }).then(handle);

export const likePost = (id) =>
  fetch(`${BASE_URL}/community/${id}/like`, { method:"PUT", headers:getHeaders() }).then(handle);

export const deletePost = (id) =>
  fetch(`${BASE_URL}/community/${id}`, { method:"DELETE", headers:getHeaders() }).then(handle);
