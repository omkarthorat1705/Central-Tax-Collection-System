import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((config) => {
  const citizenToken = localStorage.getItem("citizenToken");
  const adminToken = localStorage.getItem("token");
  const token = citizenToken || adminToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
