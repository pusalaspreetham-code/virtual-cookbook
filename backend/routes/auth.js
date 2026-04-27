const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

// REGISTER API
router.post("/register", async (req, res) => {
  try {
    //  FIRST extract values
    const { name, email, password } = req.body;

    // THEN validate
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// UPDATE profile (name + email)
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email required" });
    const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existing) return res.status(400).json({ message: "Email already in use" });
    const user = await User.findByIdAndUpdate(
      req.user.id, { name, email }, { new: true }
    ).select("-password");
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// CHANGE password
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is wrong" });
    if (newPassword.length < 6) return res.status(400).json({ message: "Password too short" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE account
router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    const { Recipe }    = require("../models/Recipe");
    const { Favorite }  = require("../models/Favorite");
    const { Community } = require("../models/Community");
    await Recipe.deleteMany({ createdBy: req.user.id });
    await Favorite.deleteMany({ userId: req.user.id });
    await Community.deleteMany({ userId: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;