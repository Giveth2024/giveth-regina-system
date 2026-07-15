const express = require('express');
const router = express.Router();

const salesController = require('../Controllers/salesController');

const { protect } = require('../middleware/authMiddleware');

// Add sales and sale items
router.post("/add", protect, salesController.addSales);

module.exports = router;