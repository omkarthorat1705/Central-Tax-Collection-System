// backend/src/services/assetService.js

const assetRepository = require("../repositories/assetRepository");

const getAssets = async (tenantId) => {
  return assetRepository.getAssets(tenantId);
};

const getAssetById = async (assetId, tenantId) => {
  const asset = await assetRepository.getAssetById(assetId, tenantId);

  if (!asset) {
    throw new Error("Asset not found");
  }

  const taxes = await assetRepository.getAssetTaxes(assetId);

  const parameters = await assetRepository.getAssetParameterValues(assetId);

  return {
    asset,
    taxes,
    parameters,
  };
};

const registerAsset = async (payload) => {
  const assetCode = `AST-${Date.now().toString().slice(-6)}`;

  const assetId = await assetRepository.createAsset({
    ...payload,
    asset_code: assetCode,
    status: "ACTIVE",
    is_deleted: 0,
  });

  if (
    Array.isArray(payload.tax_type_ids) &&
    payload.tax_type_ids.length
  ) {
    await assetRepository.createAssetTaxMappings(
      assetId,
      payload.tax_type_ids,
      payload.tenant_id,
    );
  }

  if (
    payload.parameter_values &&
    Object.keys(payload.parameter_values).length
  ) {
    await assetRepository.createAssetParameterValues(
      assetId,
      payload.parameter_values,
      payload.tenant_id,
    );
  }

  return {
    asset_id: assetId,
    asset_code: assetCode,
  };
};

const updateAsset = async (
  assetId,
  payload,
  tenantId,
) => {
  await assetRepository.updateAsset(assetId, {
    ...payload,
    tenant_id: tenantId,
  });

  if (Array.isArray(payload.tax_type_ids)) {
    await assetRepository.replaceAssetTaxMappings(
      assetId,
      payload.tax_type_ids,
      tenantId,
    );
  }

  if (payload.parameter_values) {
    await assetRepository.replaceAssetParameterValues(
      assetId,
      payload.parameter_values,
      tenantId,
    );
  }

  return {
    asset_id: assetId,
  };
};

const deleteAsset = async (
  assetId,
  tenantId,
) => {
  await assetRepository.deleteAsset(
    assetId,
    tenantId,
  );

  return {
    asset_id: assetId,
  };
};

const getAssetTypes = async () => {
  return assetRepository.getAssetTypes();
};

module.exports = {
  getAssets,
  getAssetById,
  registerAsset,
  updateAsset,
  deleteAsset,
  getAssetTypes,
};