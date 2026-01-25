import { useEffect, useState } from "react";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { useAuth } from "../../context/AuthContext";
import { Button, Form } from "antd";
import { VietBusTheme } from "../../constants/VietBusTheme.js";
import { getListTripSeatCanSell } from "../../services/TripSeatService.js";

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

  useEffect(() => {
    const fetchListTripSeatCanSell = async () => {
      const res = await getListTripSeatCanSell({});
      setListTripSeatCanSell(res?.data);
      console.log(res?.data);
    };
    fetchListTripSeatCanSell();
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
    </>
  );
};

export default TicketManagement;
