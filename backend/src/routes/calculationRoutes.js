const express = require("express");

const router = express.Router();

const { calculateTax } = require("../controllers/calculationController");

/**
 * =========================================
 * CALCULATE TAX
 * =========================================
 */

router.post("/calculateCitizenTax", calculateTax);

module.exports = router;
