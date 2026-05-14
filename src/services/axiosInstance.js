import axios from "axios";

// In-memory token store
let inMemoryToken = null;

export const tokenStore = {
  getToken: () => inMemoryToken,
  setToken: (token) => {
    inMemoryToken = token;
  },
  clearToken: () => {
    inMemoryToken = null;
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Xử lý response, đặc biệt là 401 và 403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Tránh loop vô hạn nếu request gốc bị lỗi sau khi retry
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await publicApi.post("/auth/refresh");
        const newToken = response.data.accessToken; 
        tokenStore.setToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        tokenStore.clearToken();
        // Dispatch event để AuthContext xử lý force-logout
        window.dispatchEvent(
          new CustomEvent("auth:force-logout", {
            detail: { reason: "session-expired" },
          })
        );
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
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
