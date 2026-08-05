import API from "../api/api";

export const getRevenueSummary = async () => {
  const { data } = await API.get("/getRevenueSummary");
  return data.data;
};

export const getWardWiseCollection = async () => {
  const { data } = await API.get("/getWardWiseCollection");
  return data.data;
};

export const getTaxWiseCollection = async () => {
  const { data } = await API.get("/getTaxWiseCollection");
  return data.data;
};