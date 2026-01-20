import api from "../api/api";

export const getSeatByVehicleId = async (params) => {
  const response = await api.post("/seat/get-by-vehicle-id", params);
  return response.data;
};
