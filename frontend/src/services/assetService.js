import API from "../api/api";

export const getAssets = async () => {
  const response = await API.get("/getAssets");
  return response.data.data || [];
};

export const getAssetById = async (assetId) => {
  const response = await API.get(`/assets/${assetId}`);
  return response.data.data || null;
};

export const createAsset = async (payload) => {
  const response = await API.post("/registerAsset", payload);
  return response.data.data;
};

export const updateAsset = async (assetId, payload) => {
  const response = await API.put(`/assets/${assetId}`, payload);
  return response.data.data;
};

export const getTaxTypes = async () => {
  const response = await API.get("/getTaxTypes");
  return response.data.data || [];
};

export const getAssetParameters = async (taxTypeIds) => {
  const response = await API.post("/getAssetParameters", {
    tax_type_ids: taxTypeIds,
  });

  return response.data.data || [];
};

export const getAssetTypes = async () => {
  const response = await API.get("/getAssetTypes");
  return response.data.data || [];
};

export default {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  getTaxTypes,
  getAssetParameters,
  getAssetTypes,
};