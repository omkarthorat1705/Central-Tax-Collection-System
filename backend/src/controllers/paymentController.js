const paymentService = require("../services/paymentService");
const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/responseHandler");

const makePayment = asyncHandler(async (req, res) => {
  const tenantId = req.tenant.tenant_id;
  const result = await paymentService.makePayment(req.body, tenantId);

  return successResponse(res, result);
});

const listPayments = asyncHandler(async (req, res) => {
  const tenantId = req.tenant.tenant_id;
  const result = await paymentService.listPayments(tenantId);

  return successResponse(res, result);
});

module.exports = {
  makePayment,
  listPayments,
};
