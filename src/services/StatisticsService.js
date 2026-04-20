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
