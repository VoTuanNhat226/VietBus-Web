import { createContext, useContext, useState, useEffect } from "react";
import { loginService } from "../services/AuthService.js";
import { publicApi, tokenStore } from "../services/axiosInstance.js";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const processToken = (accessToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      const userInfo = {
        username: decoded?.sub, // subject
        role: decoded?.role, // role trong JWT
        userId: decoded?.userId || decoded?.id, // id nếu có
      };
      tokenStore.setToken(accessToken);
      setToken(accessToken);
      setUser(userInfo);
    } catch (error) {
      console.error("Invalid token format", error);
      clearState();
    }
  };

  const clearState = () => {
    tokenStore.clearToken();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = tokenStore.getToken();
        if (storedToken) {
          const decoded = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            clearState();
          } else {
            processToken(storedToken);
          }
        } else {
          clearState();
        }
      } catch (err) {
        clearState();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const handleForceLogout = (event) => {
      clearState();
      const reason = event.detail?.reason || "session-expired";
      const currentPath = window.location.pathname + window.location.search;
      const redirectParam = encodeURIComponent(currentPath);
      window.location.href = `/login?reason=${reason}&redirect=${redirectParam}`;
    };

    window.addEventListener("auth:force-logout", handleForceLogout);

    return () => {
      window.removeEventListener("auth:force-logout", handleForceLogout);
    };
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await loginService(username, password);
      if (data.token) {
        processToken(data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    try {
      await publicApi.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed on server", err);
    } finally {
      clearState();
    }
  };

  const logoutAll = async () => {
    try {
      await publicApi.post("/auth/logout-all");
    } catch (err) {
      console.error("LogoutAll failed on server", err);
    } finally {
      clearState();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, logoutAll, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
