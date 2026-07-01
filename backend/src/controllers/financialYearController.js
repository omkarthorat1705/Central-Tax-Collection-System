const financialYearService = require("../services/financialYearService");

const asyncHandler = require("../utils/asyncHandler");

const getCurrentFinancialYear = asyncHandler(async (req, res) => {
  const data = await financialYearService.getCurrentFinancialYear();

  res.json({
    success: true,
    data,
  });
});

const getFinancialYears = asyncHandler(async (req, res) => {
  const data = await financialYearService.getFinancialYears();

  res.json({
    success: true,
    data,
  });
});

const freezeYear = asyncHandler(async (req, res) => {
  const { financial_year_id } = req.body;

  await financialYearService.freezeYear(financial_year_id);

  res.json({
    success: true,
    message: "Financial year frozen successfully",
  });
});

module.exports = {
  getCurrentFinancialYear,
  getFinancialYears,
  freezeYear,
};
