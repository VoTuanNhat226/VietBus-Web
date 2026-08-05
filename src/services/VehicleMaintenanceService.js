import api from "./axiosInstance";

export const getVehicleMaintenanceByVehicleId = async (params) => {
  const response = await api.post("/vehicle-maintenance/get-by-vehicle-id", params);
  return response.data;
};

export const createVehicleMaintenance = async (params) => {
  const response = await api.post("/vehicle-maintenance/create", params);
  return response.data;
};

export const updateVehicleMaintenance = async (params) => {
  const response = await api.post("/vehicle-maintenance/update", params);
  return response.data;
};
