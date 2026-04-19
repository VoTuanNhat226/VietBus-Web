import { useAuth } from "../../context/AuthContext";

const TicketManagement = () => {
  const { user } = useAuth();
  
  return (
    <>
      <h1>Ticket Management</h1>
   
    </>
  );
};

export default TicketManagement;
