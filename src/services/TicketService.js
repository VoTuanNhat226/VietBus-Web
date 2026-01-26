import api from "../api/api";

export const createTicket = async (params) => {
  const response = await api.post("/ticket/create", params);
  return response.data;
};
