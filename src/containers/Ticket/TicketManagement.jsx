import { useEffect, useState } from "react";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { useAuth } from "../../context/AuthContext";
import { Button, Form } from "antd";
import { VietBusTheme } from "../../constants/VietBusTheme.js";
import AddTicketModal from "./Modal/AddTicketModal.jsx";

const TicketManagement = () => {
  const [formInstance] = Form.useForm();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [listTripSeatCanSell, setListTripSeatCanSell] = useState([]);

  const { user } = useAuth();

  const { setTitle } = usePageTitle();
  useEffect(() => {
    setTitle("QUẢN LÝ VÉ XE");
  }, []);
  return (
    <>
      <h1>Ticket Management</h1>
      <div className="pt-4 flex justify-end">
        <Button
          type="primary"
          style={{
            backgroundColor: VietBusTheme.primary,
            color: VietBusTheme.white,
          }}
          onClick={() => setOpenAddModal(true)}
        >
          Tạo vé
        </Button>
      </div>
      {openAddModal && (
        <AddTicketModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          // onSuccess={async () => {
          //   const res = await getAllEmployee({});
          //   setListEmployee(res?.data);
          // }}
        />
      )}
    </>
  );
};

export default TicketManagement;
