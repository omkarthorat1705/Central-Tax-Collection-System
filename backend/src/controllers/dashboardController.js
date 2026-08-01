const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/responseHandler");

const getRevenueSummary = asyncHandler(async (req, res) => {
  const tenantId = req.tenant.tenant_id;
  const data = await dashboardService.getRevenueSummary(tenantId);

  return successResponse(res, data);
});

const getWardWiseCollection = asyncHandler(async (req, res) => {
  const tenantId = req.tenant.tenant_id;
  const data = await dashboardService.getWardWiseCollection(tenantId);

  return successResponse(res, data);
});

const getTaxWiseCollection = asyncHandler(async (req, res) => {
  const tenantId = req.tenant.tenant_id;
  const data = await dashboardService.getTaxWiseCollection(tenantId);

  return successResponse(res, data);
});

module.exports = {
  getRevenueSummary,
  getWardWiseCollection,
  getTaxWiseCollection,
};
