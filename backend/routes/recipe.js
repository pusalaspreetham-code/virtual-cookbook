const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const authMiddleware = require("../middleware/authMiddleware");

// ➤ ADD RECIPE (PROTECTED)
router.post("/add-recipe", authMiddleware, async (req, res) => {
  try {
    const { title, ingredients, steps, cookingTime, cuisine } = req.body;

    const recipe = new Recipe({
      title,
      ingredients,
      steps,
      cookingTime: Number(cookingTime),
      cuisine,
      createdBy: req.user.id
    });

    await recipe.save();
    res.json({ message: "Recipe added", recipe });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ GET ALL RECIPES
router.get("/recipes", async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

// ➤ SEARCH RECIPES
router.get("/advanced-search", async (req, res) => {
  try {
    const { ingredient, cuisine, maxTime } = req.query;

    let filter = {};

    if (ingredient) {
      filter.ingredients = { $in: [ingredient] };
    }

    if (cuisine) {
      filter.cuisine = cuisine;
    }

    if (maxTime) {
      filter.cookingTime = { $lte: Number(maxTime) };
    }

    const recipes = await Recipe.find(filter);

    res.json(recipes);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const Favorite = require("../models/Favorite");

    // Get user's favorited recipes
    const favorites = await Favorite.find({ userId: req.user.id }).populate("recipeId");
    if (favorites.length === 0) return res.json([]);

    // Collect all ingredients from favorited recipes
    const allIngredients = favorites
      .filter(f => f.recipeId)
      .flatMap(f => f.recipeId.ingredients);

    // Unique ingredients only
    const uniqueIngredients = [...new Set(allIngredients)];
    if (uniqueIngredients.length === 0) return res.json([]);

    // Get favorited recipe IDs to exclude them
    const favoritedIds = favorites.filter(f => f.recipeId).map(f => f.recipeId._id);

    // Find recipes that share ingredients but are NOT already in favorites
    const recommended = await Recipe.find({
      ingredients: { $in: uniqueIngredients },
      _id: { $nin: favoritedIds },
    }).limit(10);

    res.json(recommended);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// UPDATE
router.put("/recipe/:id", authMiddleware, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  // ADD THIS 👇
  if (recipe.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const updated = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

// DELETE
router.delete("/recipe/:id", authMiddleware, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  // ADD THIS 👇
  if (recipe.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await Recipe.findByIdAndDelete(req.params.id);

  res.json({ message: "Deleted" });
});
module.exports = router;