const demandService = require("../services/demandService");
const asyncHandler = require("../utils/asyncHandler");

const generateDemand = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    tenant_id: req.tenant.tenant_id,
  };

  const result = await demandService.generateDemand(payload);

  const {
    successResponse,
    errorResponse,
  } = require("../utils/responseHandler");
  return successResponse(res, result);
});

const getDemands = asyncHandler(async (req, res) => {
  const data = await demandService.getDemands(req.tenant.tenant_id);

  const {
    successResponse,
    errorResponse,
  } = require("../utils/responseHandler");
  return successResponse(res, data);
});

module.exports = {
  generateDemand,
  getDemands,
};
