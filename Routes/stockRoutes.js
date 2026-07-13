const express = require("express");
const router = express();

const { protect } = require("../middleware/authMiddleware");

const stockController = require("../Controllers/stockController");

// Adding Stock
router.post("/add", protect, stockController.addStock);

// Deleting Stock
router.delete("/:id", protect, stockController.deleteStock);

// Update Stock
router.put("/:id", protect, stockController.updateStock);

// Get Stock
router.get("/", protect, stockController.getStock);

module.exports = router;