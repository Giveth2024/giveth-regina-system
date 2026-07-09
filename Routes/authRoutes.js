const express = require('express');
const router = express.Router();

//controllers
const authController = require('../Controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Registration
router.post("/register", authController.register);

// Authentication
router.post("/login", authController.login);

// Logout
router.get("/logout", protect,authController.logout);

module.exports = router;