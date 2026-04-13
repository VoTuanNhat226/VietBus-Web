import { useEffect, useState } from "react";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { useAuth } from "../../context/AuthContext";
import { Button, Form } from "antd";
import { VietBusTheme } from "../../constants/VietBusTheme.js";
import AddTicketModal from "./Modal/AddTicketModal.jsx";

const TicketManagement = () => {
  const { user } = useAuth();
  const { setTitle } = usePageTitle();
  
  useEffect(() => {
    setTitle("QUẢN LÝ VÉ XE");
  }, [setTitle]);

  return (
    <>
      <h1>Ticket Management</h1>
   
    </>
  );
};

export default TicketManagement;
