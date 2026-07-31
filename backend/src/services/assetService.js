const assetRepository = require("../repositories/assetRepository");

const getAssets = async (tenantId) => {
  return assetRepository.getAssets(tenantId);
};

const getAssetById = async (assetId, tenantId) => {
  const asset = await assetRepository.getAssetById(assetId, tenantId);

  const taxes = await assetRepository.getAssetTaxes(assetId);

  const parameters = await assetRepository.getAssetParameterValues(assetId);

  return {
    asset,
    taxes,
    parameters,
  };
};

const registerAsset = async (payload) => {
  const assetCode = "AST-" + String(Date.now()).slice(-6);

  const assetId = await assetRepository.createAsset({
    ...payload,
    asset_code: assetCode,
    status: "ACTIVE",
    is_deleted: 0,
  });

  await assetRepository.createAssetTaxMappings(
    assetId,
    payload.tax_type_ids,
    payload.tenant_id,
  );

  await assetRepository.createAssetParameterValues(
    assetId,
    payload.parameter_values,
    payload.tenant_id,
  );

  return {
    asset_id: assetId,
  };
};

const updateAsset = async (assetId, payload, tenantId) => {
  await assetRepository.updateAsset(assetId, {
    ...payload,
    tenant_id: tenantId,
  });

  return {
    asset_id: assetId,
  };
};

const getAssetTypes = async (tenantId) => {
  return await assetRepository.getAssetTypes(tenantId);
};

module.exports = {
  getAssets,
  getAssetById,
  registerAsset,
  updateAsset,
  getAssetTypes,
};
