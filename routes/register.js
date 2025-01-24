const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { name, email, field, message, society } = req.body;

  try {
    const existingUser = await User.findOne({ email, society });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "You are already registered for this society." });
    }

    const newUser = new User({ name, email, field, message, society });
    await newUser.save();

    res.status(201).json({ success: true, message: "Registration successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

module.exports = router;
