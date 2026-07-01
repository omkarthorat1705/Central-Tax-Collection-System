import API from "../api/api";

export const getCitizens = async () => {
  const response = await API.get("/getCitizens");

  return response.data.data;
};

export const createCitizen = async (payload) => {
  const response = await API.post("/addCitizen", payload);

  return response.data.data;
};

export const getCitizenById = async (id) => {
  const response = await API.get(`/citizens/${id}`);

  return response.data.data;
};

export const updateCitizen = async (id, payload) => {
  const response = await API.put(`/citizens/${id}`, payload);

  return response.data.data;
};

export const updateCitizenStatus = async (id, status) => {
  const response = await API.patch(`/citizens/${id}/status`, {
    status,
  });

  return response.data.data;
};
