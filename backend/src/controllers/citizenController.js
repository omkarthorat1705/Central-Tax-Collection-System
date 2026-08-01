const citizenService = require("../services/citizenService");

const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/responseHandler");

const addCitizen = asyncHandler(async (req, res) => {
  if (!req.body.full_name?.trim()) {
    throw new Error("Citizen name is required");
  }

  if (!req.body.mobile_number?.trim()) {
    throw new Error("Mobile number is required");
  }

  const payload = {
    ...req.body,
    full_name: req.body.full_name?.trim(),
    mobile_number: req.body.mobile_number?.trim(),
    tenant_id: req.tenant.tenant_id,
  };

  const result = await citizenService.addCitizen(payload);

  return successResponse(res, result, "Citizen Created Successfully");
});

const getCitizens = asyncHandler(async (req, res) => {
  const data = await citizenService.getCitizens(req.tenant.tenant_id);

  return successResponse(res, data);
});

const getCitizenById = asyncHandler(async (req, res) => {
  const data = await citizenService.getCitizenById(
    req.params.id,
    req.tenant.tenant_id,
  );

  return successResponse(res, data);
});

const updateCitizen = asyncHandler(async (req, res) => {
  const data = await citizenService.updateCitizen(
    req.params.id,
    req.body,
    req.tenant.tenant_id,
  );

  return successResponse(res, data, "Citizen Updated Successfully");
});

const updateCitizenStatus = asyncHandler(async (req, res) => {
  const data = await citizenService.updateCitizenStatus(
    req.params.id,
    req.body.status,
    req.tenant.tenant_id,
  );

  return successResponse(res, data, "Citizen Status Updated");
});

module.exports = {
  addCitizen,
  getCitizens,
  getCitizenById,
  updateCitizen,
  updateCitizenStatus,
};
