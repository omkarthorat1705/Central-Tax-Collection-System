import API from "../api/api";

export const getAuthorities = async () => {
  const response = await API.get("/getAuthorities");

  return response.data.data;
};