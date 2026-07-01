import API from "../api/api";

export const getRevenueSummary = async () => {
  const response = await API.get("/getRevenueSummary");

  return response.data.data;
};
