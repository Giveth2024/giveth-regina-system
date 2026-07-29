const express = require("express");
const router = express.Router();

const {
    addProduct, addPurchase, searchProducts, createSale
} = require("../controllers/adminController");

// product routes
router.post("/products", addProduct);
router.get("/products", searchProducts);

// Purchases Routes
router.post("/purchases", addPurchase);

//Sales Routes
router.post("/sales", createSale);


module.exports = router;
