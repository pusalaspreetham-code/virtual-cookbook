const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe"
  }
});

module.exports = mongoose.model("Favorite", favoriteSchema);