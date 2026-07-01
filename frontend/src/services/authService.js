import API from "../api/api";

export const login = async (authorityCode, username, password) => {
  const response = await API.post("/login", {
    authorityCode,
    username,
    password,
  });

  return response.data.data;
};
