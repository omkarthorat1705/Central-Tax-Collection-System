const express = require("express");

const router = express.Router();

const financialYearController = require("../controllers/financialYearController");

router.get(
  "/getCurrentFinancialYear",
  financialYearController.getCurrentFinancialYear,
);

router.get("/getFinancialYears", financialYearController.getFinancialYears);

router.post("/freezeFinancialYear", financialYearController.freezeYear);

module.exports = router;
