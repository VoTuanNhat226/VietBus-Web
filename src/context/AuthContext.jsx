import { createContext, useContext, useState } from "react";
import { loginService } from "../services/AuthService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const getUserFromStorage = () => {
  try {
    const value = localStorage.getItem("user");
    if (!value || value === "undefined") return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage());
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await loginService(username, password);

      const decoded = jwtDecode(data.token);
      const userInfo = {
        username: decoded?.sub, // subject
        role: decoded?.role, // role trong JWT
        userId: decoded?.userId, // id nếu có
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userInfo));

      setToken(data.token);
      setUser(userInfo);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
