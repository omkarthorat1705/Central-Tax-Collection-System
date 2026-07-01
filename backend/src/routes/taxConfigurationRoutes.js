const express = require("express");

const router = express.Router();

const controller = require("../controllers/taxConfigurationController");

// =====================================
// TAX TYPES
// =====================================

router.get("/getTaxTypes", controller.getTaxTypes);

router.post("/addTaxType", controller.addTaxType);

// =====================================
// PARAMETERS
// =====================================

router.get("/getParameters", controller.getParameters);

router.post("/addParameter", controller.addParameter);

// =====================================
// RULES
// =====================================

router.get("/getRules", controller.getRules);

router.post("/addRule", controller.addRule);

module.exports = router;
