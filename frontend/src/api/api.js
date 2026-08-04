import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((config) => {
  const url = config.url || "";

  // Citizen APIs
  if (url.startsWith("/citizen")) {
    const token = localStorage.getItem("citizenToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  }

  // Admin APIs
  const adminToken = localStorage.getItem("token");

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default API;