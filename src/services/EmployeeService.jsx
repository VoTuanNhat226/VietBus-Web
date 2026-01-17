import api from "../api/api";

export const getAllEmployee = async (params) => {
    const response = await api.post("/employee/get-all", params);
    return response.data;
};

export const createEmployee = async (params) => {
    const response = await api.post("/employee/create", params);
    return response.data;
};

export const updateEmployee = async (params) => {
    const response = await api.post("/employee/update", params);
    return response.data;
};