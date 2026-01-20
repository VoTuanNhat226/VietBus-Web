import api from "../api/api";

export const getAllRoute = async (params) => {
  const response = await api.post("/route/get-all", params);
  return response.data;
};
