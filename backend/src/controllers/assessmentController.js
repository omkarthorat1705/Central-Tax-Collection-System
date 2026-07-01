const assessmentService = require("../services/assessmentService");
const asyncHandler = require("../utils/asyncHandler");

const generateAssessment = asyncHandler(async (req, res) => {
  const tenantId = req.tenant.tenant_id;

  const result = await assessmentService.generateAssessment(req.body, tenantId);

  const {
    successResponse,
    errorResponse,
  } = require("../utils/responseHandler");
  return successResponse(res, result);
});

module.exports = {
  generateAssessment,
};
