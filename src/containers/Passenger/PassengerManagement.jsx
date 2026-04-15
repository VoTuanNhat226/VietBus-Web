import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { useEffect, useState } from "react";
import { VietBusTheme } from "../../constants/VietBusTheme.js";
import { useAuth } from "../../context/AuthContext.jsx";
import DeletePassengerModal from "./Modal/DeletePassengerModal.jsx";
import EditPassengerModal from "./Modal/EditPassengerModal.jsx";
import CreatePassengerModal from "./Modal/CreatePassengerModal.jsx";

const PassengerManagement = () => {
  const [formInstance] = Form.useForm();
  const { user } = useAuth();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const { setTitle } = usePageTitle();
  useEffect(() => {
    setTitle("QUẢN LÝ KHÁCH HÀNG");
  }, []);

  const handleSearch = () => {
    const payload = {
      fullName: formInstance.getFieldValue("fullName"),
      phoneNumber: formInstance.getFieldValue("phoneNumber"),
      email: formInstance.getFieldValue("email"),
      IdCardNumber: formInstance.getFieldValue("IdCardNumber"),
    };
    console.log("Search payload:", payload);
  };

  const mockPassengers = [
    {
      key: 1,
      fullName: "Nguyễn Văn A",
      phoneNumber: "0901234567",
      email: "nguyenvana@gmail.com",
      idCardNumber: "079123456789",
      note: "Khách VIP, thường xuyên đặt vé",
    },
    {
      key: 2,
      fullName: "Trần Thị B",
      phoneNumber: "0912345678",
      email: "tranthib@gmail.com",
      idCardNumber: "079987654321",
      note: "Hay hủy vé sát giờ",
    },
    {
      key: 3,
      fullName: "Lê Văn C",
      phoneNumber: "0987654321",
      email: "levanc@gmail.com",
      idCardNumber: "012345678901",
      note: "Ưu tiên ghế đầu",
    },
    {
      key: 4,
      fullName: "Phạm Thị D",
      phoneNumber: "0934567890",
      email: "phamthid@gmail.com",
      idCardNumber: "098765432109",
      note: "Yêu cầu hỗ trợ đặc biệt",
    },
    {
      key: 5,
      fullName: "Hoàng Văn E",
      phoneNumber: "0971122334",
      email: "hoangvane@gmail.com",
      idCardNumber: "045612378945",
      note: "Khách mới",
    },
  ];

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Số CMND/CCCD",
      dataIndex: "idCardNumber",
      key: "idCardNumber",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-evenly">
          <i
            className="fa-regular fa-pen-to-square"
            style={{
              color: VietBusTheme.primary,
              fontSize: 18,
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedPassenger(record);
              setOpenEditModal(true);
            }}
          />
          {user.role === "ROLE_ADMIN" ? (
            <i
              className="fa-regular fa-trash-can"
              style={{
                color: VietBusTheme.error,
                fontSize: 18,
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedPassenger(record);
                setOpenDeleteModal(true);
              }}
            />
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <h2>Search area</h2>
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item name="fullName">
              <Input placeholder="Họ và tên" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="phoneNumber">
              <Input
                maxLength={10}
                placeholder="Số điện thoại"
                inputMode="numeric"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="email">
              <Input placeholder="Email" type="email" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="IdCardNumber">
              <Input placeholder="Số CMND/CCCD" inputMode="numeric" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" gutter={8}>
          <Col>
            <Button htmlType="reset" onClick={() => formInstance.resetFields()}>
              Reset
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: VietBusTheme.primary,
                color: VietBusTheme.white,
              }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>
      {user?.role === "ROLE_ADMIN" ? (
        <div className="pt-4 flex justify-end">
          <Button
            type="primary"
            style={{
              backgroundColor: VietBusTheme.primary,
              color: VietBusTheme.white,
            }}
            onClick={() => setOpenCreateModal(true)}
          >
            Thêm khách hàng
          </Button>
        </div>
      ) : null}
      <Table className="pt-4" dataSource={mockPassengers} columns={columns} />
      <DeletePassengerModal
        openDeleteModal={openDeleteModal}
        onConfirm={() => {
          setOpenDeleteModal(false);
        }}
        onCancel={() => {
          setOpenDeleteModal(false);
          setSelectedPassenger(null);
        }}
        passenger={selectedPassenger}
      />
      <EditPassengerModal
        openEditModal={openEditModal}
        onConfirm={() => {
          setOpenEditModal(false);
        }}
        onCancel={() => {
          setOpenEditModal(false);
          setSelectedPassenger(null);
        }}
        passenger={selectedPassenger}
      />
      <CreatePassengerModal
        openCreateModal={openCreateModal}
        onConfirm={() => {
          setOpenCreateModal(false);
        }}
        onCancel={() => {
          setOpenCreateModal(false);
        }}
      />
    </div>
  );
};

export default PassengerManagement;
