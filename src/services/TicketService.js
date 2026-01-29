import api from "../api/api";

export const createTicket = async (params) => {
  const response = await api.post("/ticket/create", params);
  return response.data;
};

export const updateTicket = async (params) => {
  const response = await api.post("/ticket/update", params);
  return response.data;
};

export const getAllTicketsUnpaid = async (params) => {
  const response = await api.post("/ticket/get-all-ticket-unpaid", params);
  return response.data;
};
