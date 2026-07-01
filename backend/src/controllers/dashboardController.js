const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");

const getRevenueSummary = asyncHandler(async (req, res) => {
  const tenantId = req.tenant.tenant_id;

    const data = await dashboardService.getRevenueSummary(tenantId);

    const {
      successResponse,
      errorResponse,
    } = require("../utils/responseHandler");
    return successResponse(res, data);
});

module.exports = {
  getRevenueSummary,
};
