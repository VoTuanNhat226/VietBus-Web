import api from "../api/api";

export const getAllAccount = async (params) => {
  const response = await api.post("/account/get-all", params);
  return response.data;
};

export const getAllAccountByRole = async (params) => {
  const response = await api.post("/account/get-all-by-role", params);
  return response.data;
};

export const createAccount = async (params) => {
  const response = await api.post("/account/create", params);
  return response.data;
};
