const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const authMiddleware = require("../middleware/authMiddleware");

// ADD TO FAVORITES
// ADD TO FAVORITES — with duplicate check
router.post("/favorite", authMiddleware, async (req, res) => {
  try {
    const { recipeId } = req.body;

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: req.user.id,
      recipeId: recipeId
    });

    if (existing) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    const fav = new Favorite({ userId: req.user.id, recipeId });
    await fav.save();
    res.json({ message: "Added to favorites" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET FAVORITES
router.get("/favorites", authMiddleware, async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user.id })
    .populate("recipeId");

  res.json(favorites);
});

// REMOVE FROM FAVORITES
router.delete("/favorite/:recipeId", authMiddleware, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      userId: req.user.id,
      recipeId: req.params.recipeId
    });
    res.json({ message: "Removed from favorites" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


module.exports = router;