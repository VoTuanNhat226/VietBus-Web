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
import { useEffect, useState } from "react";
import { VietBusTheme } from "../../constants/VietBusTheme.js";
import { useAuth } from "../../context/AuthContext.jsx";
import DeletePassengerModal from "./Modal/DeletePassengerModal.jsx";
import EditPassengerModal from "./Modal/EditPassengerModal.jsx";
import CreatePassengerModal from "./Modal/CreatePassengerModal.jsx";
import { searchPassenger } from "../../services/PassengerService.js";

const PassengerManagement = () => {
  const [formInstance] = Form.useForm();
  const { user } = useAuth();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPassengers = async (page = 1, size = 10, searchParams = {}) => {
    setLoading(true);
    try {
      const payload = {
        page: page - 1,
        size,
        ...searchParams,
      };
      const response = await searchPassenger(payload);
      if (response && response.statusCode === 200) {
        setPassengers(response.data || []);
        setPagination((prev) => ({
          ...prev,
          current: (response.meta?.page?.pageNumber ?? 0) + 1,
          pageSize: response.meta?.page?.pageSize ?? 10,
          total: response.meta?.page?.totalElements ?? 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching passengers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (newPagination) => {
    const searchParams = formInstance.getFieldsValue();
    fetchPassengers(newPagination.current, newPagination.pageSize, searchParams);
  };

  const handleSearch = () => {
    const searchParams = formInstance.getFieldsValue();
    fetchPassengers(1, pagination.pageSize, searchParams);
  };

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
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "Số CMND/CCCD",
      dataIndex: "idCardNumber",
      key: "idCardNumber",
      align: "center",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
      align: "center",
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
        <Form form={formInstance}>
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
            <Form.Item name="idCardNumber">
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
        </Form>
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
      <Table
        className="pt-4"
        dataSource={passengers}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey={(record) => record.id || record.idCardNumber || Math.random()}
      />
      <DeletePassengerModal
        openDeleteModal={openDeleteModal}
        onSuccess={() => {
          setOpenDeleteModal(false);
          fetchPassengers(pagination.current, pagination.pageSize);
        }}
        onCancel={() => {
          setOpenDeleteModal(false);
          setSelectedPassenger(null);
        }}
        passenger={selectedPassenger}
      />
      <EditPassengerModal
        openEditModal={openEditModal}
        onSuccess={() => {
          setOpenEditModal(false);
          fetchPassengers(pagination.current, pagination.pageSize);
        }}
        onCancel={() => {
          setOpenEditModal(false);
          setSelectedPassenger(null);
        }}
        passenger={selectedPassenger}
      />
      <CreatePassengerModal
        openCreateModal={openCreateModal}
        onSuccess={() => {
          setOpenCreateModal(false);
          fetchPassengers();
        }}
        onCancel={() => {
          setOpenCreateModal(false);
        }}
      />
    </div>
  );
};

export default PassengerManagement;
