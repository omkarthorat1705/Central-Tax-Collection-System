import API from "../api/api";

const extractData = (response) => response?.data?.data ?? response?.data ?? [];

export const getAssets = async () => {
  const response = await API.get("/assets/getAssets");
  return extractData(response);
};

export const getAssetById = async (assetId) => {
  const response = await API.get(`/assets/${assetId}`);
  return extractData(response);
};

export const createAsset = async (payload) => {
  const response = await API.post("/assets/registerAsset", payload);
  return extractData(response);
};

export const updateAsset = async (assetId, payload) => {
  const response = await API.put(`/assets/${assetId}`, payload);
  return extractData(response);
};

export const deleteAsset = async (assetId) => {
  const response = await API.delete(`/assets/${assetId}`);
  return extractData(response);
};

export const getAssetTypes = async () => {
  const response = await API.get("/assets/getAssetTypes");
  return extractData(response);
};

export const getTaxTypes = async () => {
  const response = await API.get("/getTaxTypes");
  return extractData(response);
};

export const getAssetParameters = async (taxTypeIds) => {
  const response = await API.post("/getAssetParameters", {
    tax_type_ids: Array.isArray(taxTypeIds) ? taxTypeIds.map(Number) : [],
  });
  return extractData(response);
};

const assetService = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetTypes,
  getTaxTypes,
  getAssetParameters,
};

export default assetService;
