import api from "./axiosInstance";

export const getAllPassenger = async () => {
  const response = await api.post("/passenger/get-all");
  return response.data;
};

export const getPassenger = async (params) => {
  const response = await api.post("/passenger/get", params);
  return response.data;
};

export const createPassenger = async (params) => {
  const response = await api.post("/passenger/create", params);
  return response.data;
};

export const updatePassenger = async (params) => {
  const response = await api.post("/passenger/update", params);
  return response.data;
};

export const deletePassenger = async (params) => {
  const response = await api.post("/passenger/delete", params);
  return response.data;
};

export const searchPassenger = async (params) => {
  const response = await api.post("/passenger/search", params);
  return response.data;
};
