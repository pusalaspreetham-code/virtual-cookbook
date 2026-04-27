const express = require("express");
const router  = express.Router();
const Community  = require("../models/Community");
const authMiddleware = require("../middleware/authMiddleware");

// GET all posts (newest first)
router.get("/community", async (req, res) => {
  try {
    const posts = await Community.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name");
    res.json(posts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// CREATE post
router.post("/community", authMiddleware, async (req, res) => {
  try {
    const { content, cuisine } = req.body;
    if (!content || content.trim().length < 5)
      return res.status(400).json({ message: "Post too short" });
    const post = await Community.create({
      userId: req.user.id, content: content.trim(), cuisine: cuisine || "General"
    });
    const populated = await post.populate("userId", "name");
    res.json(populated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// LIKE / UNLIKE post
router.put("/community/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const idx = post.likes.indexOf(req.user.id);
    if (idx === -1) post.likes.push(req.user.id);
    else            post.likes.splice(idx, 1);
    await post.save();
    const populated = await post.populate("userId", "name");
    res.json(populated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE post (only owner)
router.delete("/community/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    await Community.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
