const express = require("express");
const path = require('path');

const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Home page
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Auth pages
router.get("/auth/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "auth", "login.html"));
});

// Stock Pages
router.get("/stock/add", protect, (req, res) => {
    res.sendFile(path.join(__dirname, '..', "public", "stock", "addStock.html"));
});

router.get("/stock/view", protect, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "stock", "viewStock.html"));
});

module.exports = router;