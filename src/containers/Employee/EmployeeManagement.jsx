import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import { VietBusTheme } from "../../constants/VietBusTheme.js";
import { useEffect, useMemo, useState } from "react";
import {
  deleteEmployee,
  getAllEmployee,
} from "../../services/EmployeeService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import AddEmployeeModal from "./Modal/AddEmployeeModal.jsx";
import UpdateEmployeeModal from "./Modal/UpdateEmployeeModal.jsx";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../constants/Constants.js";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { formatDateTime } from "../../utils/Utils.js";

const EmployeeManagement = () => {
  const { user } = useAuth();
  const { setTitle } = usePageTitle();
  const [formInstance] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [listEmployee, setListEmployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async (payload = {}) => {
    try {
      setIsLoading(true);
      const res = await getAllEmployee(payload);
      setListEmployee(res?.data || []);
    } catch (e) {
      message.error("Lấy danh sách nhân viên thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = () => {
    const payload = formInstance.getFieldsValue();
    fetchEmployees(payload);
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      setIsLoading(true);
      await deleteEmployee({ employeeId: selectedEmployee.employeeId });
      message.success("Xóa nhân viên thành công");

      await fetchEmployees();

      setOpenDeleteModal(false);
      setSelectedEmployee(null);
    } catch (e) {
      message.error("Xóa nhân viên thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
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
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        align: "center",
      },
      {
        title: "Chức vụ",
        dataIndex: "position",
        key: "position",
        align: "center",
        render: (value) =>
          ROLE_OPTIONS.find((opt) => opt.value === value)?.label || value,
      },
      {
        title: "Trạng thái",
        dataIndex: "active",
        key: "active",
        align: "center",
        render: (value) => (
          <span
            style={{
              color:
                value === false ? VietBusTheme.error : VietBusTheme.success,
            }}
          >
            {value === true ? "Hoạt động" : "Không hoạt động"}
          </span>
        ),
      },
      {
        title: "Người tạo",
        dataIndex: "createdBy",
        key: "createdBy",
        align: "center",
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "center",
        render: (value) => (value ? formatDateTime(value) : ""),
      },
      {
        title: "Người cập nhật",
        dataIndex: "updatedBy",
        key: "updatedBy",
        align: "center",
      },
      {
        title: "Ngày cập nhật",
        dataIndex: "updatedAt",
        key: "updatedAt",
        align: "center",
        render: (value) => (value ? formatDateTime(value) : ""),
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
                setSelectedEmployee(record);
                setOpenUpdateModal(true);
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
                  setSelectedEmployee(record);
                  setOpenDeleteModal(true);
                }}
              />
            ) : null}
          </div>
        ),
      },
    ],
    [],
  );

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
              <Form.Item name="position">
                <Select placeholder="Chức vụ" options={ROLE_OPTIONS}></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="active">
                <Select
                  placeholder="Trạng thái"
                  options={ACTIVE_OPTIONS}
                ></Select>
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
              <Button onClick={() => formInstance.resetFields()}>Reset</Button>
            </Col>
            <Col>
              <Button
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
            onClick={() => setOpenAddModal(true)}
          >
            Thêm nhân viên
          </Button>
        </div>
      ) : null}
      <Table
        className="pt-4"
        loading={isLoading}
        dataSource={listEmployee}
        columns={columns}
        rowKey="employeeId"
      />
      {/* ADD Employee Modal*/}
      {openAddModal && (
        <AddEmployeeModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={fetchEmployees}
        />
      )}
      {/* UPDATE Employee Modal*/}
      {openUpdateModal && (
        <UpdateEmployeeModal
          open={openUpdateModal}
          employee={selectedEmployee}
          onClose={() => {
            setOpenUpdateModal(false);
            setSelectedEmployee(null);
          }}
          onSuccess={fetchEmployees}
        />
      )}
      {/* DELETE Employee MODAL */}
      {openDeleteModal && (
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
          width={440}
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
            <p>
              Bạn có chắc chắn xóa nhân viên
              <b> {selectedEmployee?.fullName} </b> không?
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmployeeManagement;
