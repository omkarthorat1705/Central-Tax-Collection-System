const { calculateCitizenTax } = require("../services/taxCalculationEngine");
const asyncHandler = require("../utils/asyncHandler");

/**
 * =========================================
 * CALCULATE CITIZEN TAX
 * =========================================
 */

const calculateTax = asyncHandler(async (req, res) => {
  const { citizen_tax_record_id } = req.body;

  if (!citizen_tax_record_id) {
    return errorResponse(res, "citizen_tax_record_id is required", 400);
  }

  const result = await calculateCitizenTax(citizen_tax_record_id);

  const {
    successResponse,
    errorResponse,
  } = require("../utils/responseHandler");
  return successResponse(res, result);
});

module.exports = {
  calculateTax,
};
