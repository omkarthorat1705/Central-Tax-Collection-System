import axios from "axios";

export const loginUser = async (payload) => {
  const response = await axios.post("http://localhost:5000/login", payload);

  return response.data;
};
