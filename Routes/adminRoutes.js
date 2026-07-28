const express = require("express");
const router = express.Router();

const {
    addProduct, addPurchase
} = require("../controllers/adminController");

// product routes
router.post("/products", addProduct);

// Purchases Routes
router.post("/purchases", addPurchase);

module.exports = router;
