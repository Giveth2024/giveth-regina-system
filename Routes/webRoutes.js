const express = require("express");
const path = require('path')

const router = express.Router();

// Home page
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Auth pages
router.get("/auth/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "auth", "login.html"));
});

module.exports = router;