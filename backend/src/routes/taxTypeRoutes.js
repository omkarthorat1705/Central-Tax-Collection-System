const express = require("express");

const router = express.Router();

const {
  getTaxTypes,
  addTaxType,
  deleteTaxType,
} = require("../controllers/taxTypeController");

router.get("/getTaxTypes", getTaxTypes);

router.post("/addTaxType", addTaxType);

router.delete("/deleteTaxType/:id", deleteTaxType);

module.exports = router;
