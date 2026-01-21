import { useEffect } from "react";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { useAuth } from "../../context/AuthContext";

const TripManagement = () => {
  const { user } = useAuth();

  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("QUẢN LÝ CHUYẾN XE");
  }, []);
  return <h1>Trip Management</h1>;
};

export default TripManagement;
