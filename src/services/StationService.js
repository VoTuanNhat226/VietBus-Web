import api from "../api/api";

export const getAllStation = async (params) => {
  const response = await api.post("/station/get-all", params);
  return response.data;
};
