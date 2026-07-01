const paymentService = require("../services/paymentService");
const asyncHandler = require("../utils/asyncHandler");

const makePayment = asyncHandler(async (req, res) => {
  // =====================================
  // TENANT FROM MIDDLEWARE
  // =====================================

  const tenantId = req.tenant.tenant_id;

  const result = await paymentService.makePayment(req.body, tenantId);

  const {
    successResponse,
    errorResponse,
  } = require("../utils/responseHandler");
  return successResponse(res, result);
});

module.exports = {
  makePayment,
};
