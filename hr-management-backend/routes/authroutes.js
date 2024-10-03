// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { registerUser, login } = require("../controllers/authController");

// Register Route (Public)
router.post("/register/:role", registerUser);


// Login Route (Public)
router.post("/login", login);

module.exports = router;
