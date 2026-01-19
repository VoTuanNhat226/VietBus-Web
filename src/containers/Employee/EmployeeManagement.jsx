import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
} from "antd";
import { VietBusTheme } from "../../constants/VietBusTheme.js";
import { useEffect, useState } from "react";
import {
  deleteEmployee,
  getAllEmployee,
} from "../../services/EmployeeService.js";
import moment from "moment";
import { useAuth } from "../../context/AuthContext.jsx";
import AddEmployeeModal from "./Modal/AddEmployeeModal.jsx";
import UpdateEmployeeModal from "./Modal/UpdateEmployeeModal.jsx";
import { ROLE } from "../../constants/Contans.js";

const EmployeeManagement = () => {
  const [formInstance] = Form.useForm();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [listEmployee, setListEmployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchAllEmployee = async () => {
      const res = await getAllEmployee({});
      setListEmployee(res?.data);
    };
    fetchAllEmployee();
  }, []);

  const handleSearch = async () => {
    const payload = {
      firstName: formInstance.getFieldValue("firstName"),
      lastName: formInstance.getFieldValue("lastName"),
      phoneNumber: formInstance.getFieldValue("phoneNumber"),
      position: formInstance.getFieldValue("position"),
      createdBy: formInstance.getFieldValue("createdBy"),
      updatedBy: formInstance.getFieldValue("updatedBy"),
    };
    const res = await getAllEmployee(payload);
    setListEmployee(res?.data);
  };

  const handlAddEmployee = () => {
    setOpenAddModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setOpenUpdateModal(true);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      await deleteEmployee({ employeeId: selectedEmployee.employeeId });

      message.success("Xóa nhân viên thành công");

      const res = await getAllEmployee({});
      setListEmployee(res?.data);

      setOpenDeleteModal(false);
      setSelectedEmployee(null);
    } catch (e) {
      message.error("Xóa nhân viên thất bại");
    }
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
      title: "Họ và tên lót",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Tên",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (value) => (
        <span
          style={{
            color: value === false ? VietBusTheme.error : VietBusTheme.success,
          }}
        >
          {value === true ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "created_by",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
    },
    {
      title: "Người cập nhật",
      dataIndex: "updatedBy",
      key: "updatedBy",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) =>
        value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
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
            onClick={() => handleEditEmployee(record)}
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
                setSelectedEmployee(record);
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
              <Form.Item name="lastName">
                <Input placeholder="Họ và tên lót" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="firstName">
                <Input placeholder="Tên" />
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
              <Form.Item name="position">
                <Select placeholder="Chức vụ" options={ROLE}></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="createdBy">
                <Input placeholder="Người tạo" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="updatedBy">
                <Input placeholder="Người cập nhật" />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={8}>
            <Col>
              <Button
                htmlType="reset"
                onClick={() => formInstance.resetFields()}
              >
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
            onClick={handlAddEmployee}
          >
            Thêm nhân viên
          </Button>
        </div>
      ) : null}
      <Table className="pt-4" dataSource={listEmployee} columns={columns} />
      {/* ADD Modal*/}
      <AddEmployeeModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={async () => {
          const res = await getAllEmployee({});
          setListEmployee(res?.data);
        }}
      />
      {/* UPDATE Modal*/}
      <UpdateEmployeeModal
        open={openUpdateModal}
        employee={selectedEmployee}
        onClose={() => {
          setOpenUpdateModal(false);
          setSelectedEmployee(null);
        }}
        onSuccess={async () => {
          const res = await getAllEmployee({});
          setListEmployee(res?.data);
        }}
      />
      {/* DELETE MODAL */}
      <Modal
        open={openDeleteModal}
        footer={
          <div className="flex justify-center">
            <Button
              className="mr-2"
              onClick={() => {
                setOpenDeleteModal(false);
              }}
            >
              Đóng
            </Button>
            <Button
              type="primary"
              className="ml-2"
              style={{
                backgroundColor: VietBusTheme.primary,
                color: VietBusTheme.white,
              }}
              onClick={handleDeleteEmployee}
            >
              Xóa
            </Button>
          </div>
        }
        onCancel={() => {
          setOpenDeleteModal(false);
          setSelectedEmployee(null);
        }}
        width={400}
      >
        <div className="flex flex-col items-center gap-2">
          <h2>
            <i
              class="fa-solid fa-triangle-exclamation pr-2"
              style={{
                color: VietBusTheme.error,
                fontSize: 14,
                cursor: "pointer",
              }}
            />
            Cảnh báo
          </h2>
          <p>Bạn có chắc chắn xóa không?</p>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
