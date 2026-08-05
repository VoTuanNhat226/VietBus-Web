import axios from "axios";

export const tokenStore = {
  getToken: () => localStorage.getItem("accessToken"),
  setToken: (token) => {
    localStorage.setItem("accessToken", token);
  },
  clearToken: () => {
    localStorage.removeItem("accessToken");
  },
};

const baseURL = import.meta.env.VITE_API_URL;

// publicApi cho các request không cần auth (login, refresh, logout)
export const publicApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// api chính cho các request cần auth
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Tự động gắn token từ in-memory store
api.interceptors.request.use((config) => {
  const token = tokenStore.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý response, đặc biệt là 401 và 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clearToken();
      window.dispatchEvent(
        new CustomEvent("auth:force-logout", {
          detail: { reason: "session-expired" },
        })
      );
    }

    if (error.response?.status === 403) {
      // Reuse detected hoặc vi phạm bảo mật
      tokenStore.clearToken();
      window.dispatchEvent(
        new CustomEvent("auth:force-logout", {
          detail: { reason: "security-violation" },
        })
      );
    }

    return Promise.reject(error);
  }
);

export default api;
