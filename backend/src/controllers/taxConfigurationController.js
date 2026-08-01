const service = require("../services/taxConfigurationService");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const getTaxTypes = asyncHandler(async (req, res) => {
  const data = await service.getTaxTypes(req.tenant.tenant_id);
  return successResponse(res, data);
});

const addTaxType = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    tenant_id: req.tenant.tenant_id,
    created_by: req.user?.user_id || 1,
  };

  const id = await service.addTaxType(payload);

  return successResponse(res, { id }, "Tax Type Added Successfully");
});

const getParameters = asyncHandler(async (req, res) => {
  const data = await service.getParameters(req.tenant.tenant_id);
  return successResponse(res, data);
});

const addParameter = asyncHandler(async (req, res) => {
  if (!req.body.parameter_name?.trim()) {
    return errorResponse(res, "Parameter Name is required", 400);
  }

  const payload = {
    ...req.body,
    tenant_id: req.tenant.tenant_id,
    created_by: req.user?.user_id || 1,
    required_flag: req.body.required_flag ? 1 : 0,
  };

  const id = await service.addParameter(payload);

  return successResponse(res, { id }, "Parameter Added Successfully");
});

const getRules = asyncHandler(async (req, res) => {
  const data = await service.getRules(req.tenant.tenant_id);
  return successResponse(res, data);
});

const addRule = asyncHandler(async (req, res) => {
  if (!req.body.rule_name?.trim()) {
    return errorResponse(res, "Rule Name is required", 400);
  }

  const payload = {
    ...req.body,
    tenant_id: req.tenant.tenant_id,
    created_by: req.user?.user_id || 1,
  };

  const id = await service.addRule(payload);

  return successResponse(res, { id }, "Rule Added Successfully");
});

module.exports = {
  getTaxTypes,
  addTaxType,
  getParameters,
  addParameter,
  getRules,
  addRule,
};
