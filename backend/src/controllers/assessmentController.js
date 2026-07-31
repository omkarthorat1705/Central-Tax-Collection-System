const assessmentService = require("../services/assessmentService");
const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/responseHandler");

const generateAssessment = asyncHandler(async (req, res) => {
  const tenantId = req.tenant.tenant_id;

  const result = await assessmentService.generateAssessment(req.body, tenantId);

  return successResponse(res, result);
});

const listAssessments = asyncHandler(async (req, res) => {
  const tenantId = req.tenant.tenant_id;
  const result = await assessmentService.listAssessments(tenantId);

  return successResponse(res, result);
});

module.exports = {
  generateAssessment,
  listAssessments,
};
