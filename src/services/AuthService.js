import { publicApi } from "./axiosInstance";

export const loginService = async (username, password) => {
  const response = await publicApi.post("/auth/login", {
    username,
    password,
  });
  return response.data; // expect { token: "access_token_jwt" }
};
