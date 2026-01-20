import api from "../api/api";

export const getAllVehicle = async (params) => {
  const response = await api.post("/vehicle/get-all", params);
  return response.data;
};

export const getVehicleId = async (params) => {
  const response = await api.post("/vehicle/get-by-id", params);
  return response.data;
};
