import api from "../api/api";

export const getAllPayment = async (params) => {
  const response = await api.post("/payment/get-all", params);
  return response.data;
};