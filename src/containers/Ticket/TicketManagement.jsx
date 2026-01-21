import { useEffect } from "react";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { useAuth } from "../../context/AuthContext";

const TicketManagement = () => {
  const { user } = useAuth();

  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("QUẢN LÝ VÉ XE");
  }, []);
  return <h1>Ticket Management</h1>;
};

export default TicketManagement;
