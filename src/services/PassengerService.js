import api from "../api/api";

export const createPassenger = async (params) => {
  const response = await api.post("/passenger/create", params);
  return response.data;
};
