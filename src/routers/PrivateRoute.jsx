import {Navigate, Outlet} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner if preferred
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
