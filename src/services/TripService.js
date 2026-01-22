import api from "../api/api";

export const getAllTrip = async (params) => {
  const response = await api.post("/trip/get-all", params);
  return response.data;
};

export const createTrip = async (params) => {
  const response = await api.post("/trip/create", params);
  return response.data;
};
