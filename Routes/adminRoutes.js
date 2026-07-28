const express = require("express");
const router = express.Router();

const {
    addProduct
} = require("../controllers/adminController");

router.post("/products", addProduct);

module.exports = router;
