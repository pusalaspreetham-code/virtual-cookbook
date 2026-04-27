const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  steps: [String],
  cookingTime: Number,
  cuisine: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);