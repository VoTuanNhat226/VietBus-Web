import api from "../api/api";

export const getAllRoute = async (params) => {
  const response = await api.post("/route/get-all", params);
  return response.data;
};

export const createRoute = async (params) => {
  const response = await api.post("/route/create", params);
  return response.data;
};

export const updateRoute = async (params) => {
  const response = await api.post("/route/update", params);
  return response.data;
};
