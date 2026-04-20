import api from "../api/api";

export const getRevenueByMonth = async (data) => {
  const response = await api.post("/statistics/get-revenue-by-month", data);
  return response.data;
};

export const getTotalTicketByMonth = async (data) => {
  const response = await api.post("/statistics/total-ticket-by-month", data);
  return response.data;
};

export const getTotalTripByMonth = async (data) => {
  const response = await api.post("/statistics/total-trip-by-month", data);
  return response.data;
};

export const getTotalPassengerByMonth = async (data) => {
  const response = await api.post("/statistics/total-passenger-by-month", data);
  return response.data;
};

export const getTotalVehicle = async (data) => {
  const response = await api.post("/statistics/total-vehicle", data);
  return response.data;
};

export const getAllTripDeparted = async (data) => {
  const response = await api.post("/statistics/get-all-trip-departed", data);
  return response.data;
};
