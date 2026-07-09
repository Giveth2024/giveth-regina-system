const express = require('express');
const router = express.Router();

//controllers
const authController = require('../Controllers/authController');

// Registration
router.post("/register", authController.register);

// Authentication
router.post("/login", authController.login);

module.exports = router;