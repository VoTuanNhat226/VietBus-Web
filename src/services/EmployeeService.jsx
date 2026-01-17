import api from "../api/api";

export const getAllEmployee = async (params) => {
  const response = await api.post("/employee/get-all", params);
  return response.data;
};
