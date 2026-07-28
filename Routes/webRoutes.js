const express = require("express");
const router = express.Router();
const path = require('path');

// Products pages
router.get("/product/add", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/addProduct.html"));
});

module.exports = router;