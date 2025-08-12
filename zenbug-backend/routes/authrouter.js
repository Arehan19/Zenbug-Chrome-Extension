const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../model/user");

// Seed admin (just once)
router.post("/seed-admin", async (req, res) => {
  const existing = await User.findOne({ username: "admin" });
  if (existing) return res.status(400).json({ msg: "Already exists" });

  const hashed = await bcrypt.hash("admin123", 10);
  const admin = new User({ username: "admin", password: hashed });
  await admin.save();
  res.json({ msg: "Admin created" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  res.json({ token });
});

module.exports = router;
