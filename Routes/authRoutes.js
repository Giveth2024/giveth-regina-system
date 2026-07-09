const express = require('express');
const router = express.Router();

//controllers
const authController = require('../Controllers/authController');

router.post("/register", authController.register);

module.exports = router;