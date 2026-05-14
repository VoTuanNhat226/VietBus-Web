import api from "./axiosInstance";

export const countTripSeatSoldByTripId = async (params) => {
  const response = await api.post(
    "/trip-seat/count-trip-seat-sold-by-trip-id",
    params
  );
  return response.data;
};

export const getAllTripSeatByTripId = async (params) => {
  const response = await api.post(
    "/trip-seat/get-all-trip-seat-by-trip-id",
    params
  );
  return response.data;
};

export const getListTripSeatAvailableByTripId = async (params) => {
  const response = await api.post("/trip-seat/get-all-trip-seat-available-by-trip-id", params);
  return response.data;
};
