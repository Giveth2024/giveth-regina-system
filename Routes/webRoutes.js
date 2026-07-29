const express = require("express");
const router = express.Router();
const path = require('path');

// Products pages
router.get("/product/add", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/addProduct.html"));
});

// Purchases Pages
router.get("/purchases/add", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/addPurchases.html"));
});

// Sales Page
router.get("/sales/add", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/addSales.html"));
});

module.exports = router;