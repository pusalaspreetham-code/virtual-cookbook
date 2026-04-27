const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, maxlength: 500 },
  cuisine: { type: String, default: "General" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Community", communitySchema);
