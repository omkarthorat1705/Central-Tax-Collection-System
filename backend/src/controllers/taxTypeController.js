const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const taxConfigurationService = require("../services/taxConfigurationService");

const getTaxTypes = asyncHandler(async (req, res) => {
  const data = await taxConfigurationService.getTaxTypes(req.tenant.tenant_id);
  return successResponse(res, data);
});

const addTaxType = asyncHandler(async (req, res) => {
  const { tax_code, tax_name, description } = req.body;

  if (!tax_name?.trim()) {
    return errorResponse(res, "Tax Name is required", 400);
  }

  const payload = {
    tenant_id: req.tenant.tenant_id,
    tax_code: tax_code || null,
    tax_name: tax_name.trim(),
    description: description || null,
    created_by: req.user?.user_id || 1,
  };

  const id = await taxConfigurationService.addTaxType(payload);

  return successResponse(res, { id }, "Tax Type Added Successfully");
});

const deleteTaxType = asyncHandler(async (req, res) => {
  await taxConfigurationService.deleteTaxType(req.tenant.tenant_id, req.params.id);

  return successResponse(res, { deleted: true }, "Tax Type Deleted");
});

module.exports = {
  getTaxTypes,
  addTaxType,
  deleteTaxType,
};
