// backend/src/controllers/assetController.js

const assetService = require("../services/assetService");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/responseHandler");

const getAssets = asyncHandler(async (req, res) => {
  const data = await assetService.getAssets(req.tenant.tenant_id);
  return successResponse(res, data);
});

const getAssetById = asyncHandler(async (req, res) => {
  const data = await assetService.getAssetById(
    req.params.id,
    req.tenant.tenant_id,
  );

  return successResponse(res, data);
});

const registerAsset = asyncHandler(async (req, res) => {
  const result = await assetService.registerAsset({
    ...req.body,
    tenant_id: req.tenant.tenant_id,
  });

  return successResponse(
    res,
    result,
    "Asset registered successfully",
  );
});

const updateAsset = asyncHandler(async (req, res) => {
  const result = await assetService.updateAsset(
    req.params.id,
    req.body,
    req.tenant.tenant_id,
  );

  return successResponse(
    res,
    result,
    "Asset updated successfully",
  );
});

const deleteAsset = asyncHandler(async (req, res) => {
  const result = await assetService.deleteAsset(
    req.params.id,
    req.tenant.tenant_id,
  );

  return successResponse(
    res,
    result,
    "Asset deleted successfully",
  );
});

const getAssetTypes = asyncHandler(async (req, res) => {
  const data = await assetService.getAssetTypes(
    req.tenant.tenant_id,
  );

  return successResponse(res, data);
});

module.exports = {
  getAssets,
  getAssetById,
  registerAsset,
  updateAsset,
  deleteAsset,
  getAssetTypes,
};