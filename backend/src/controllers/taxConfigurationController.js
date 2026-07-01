const service = require("../services/taxConfigurationService");
const asyncHandler = require("../utils/asyncHandler");

// =====================================
// TAX TYPES
// =====================================

const getTaxTypes = asyncHandler(async (req, res) => {
  const data = await service.getTaxTypes(req.tenant.tenant_id);

  const {
    successResponse,
    errorResponse,
  } = require("../utils/responseHandler");
  return successResponse(res, data);
});

const addTaxType = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    tenant_id: req.tenant.tenant_id,
    created_by: 1,
  };

  const id = await service.addTaxType(payload);

  return successResponse(res, { id });
});

// =====================================
// PARAMETERS
// =====================================

const getParameters = asyncHandler(async (req, res) => {
  const data = await service.getParameters(req.tenant.tenant_id);

  return successResponse(res, data);
});

const addParameter = asyncHandler(async (req, res) => {
  return errorResponse(res, error.message);
});

const addParameter = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    tenant_id: req.tenant.tenant_id,
  };

  const id = await service.addParameter(payload);

  return successResponse(res, { id });
});

// =====================================
// RULES
// =====================================

const getRules = asyncHandler(async (req, res) => {
  const data = await service.getRules(req.tenant.tenant_id);

  return successResponse(res, data);
});

const addRule = asyncHandler(async (req, res) => {
  return errorResponse(res, error.message);
});

const addRule = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    tenant_id: req.tenant.tenant_id,
    created_by: 1,
  };

  const id = await service.addRule(payload);

  return successResponse(res, { id });
});

module.exports = {
  getTaxTypes,
  addTaxType,

  getParameters,
  addParameter,

  getRules,
  addRule,
};
