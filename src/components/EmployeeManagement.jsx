import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import { VietBusTheme } from "../constants/VietBusTheme";
import { useEffect, useState } from "react";
import { getAllEmployee } from "../services/EmployeeService";
import moment from "moment";
import { EditOutlined } from "@ant-design/icons";

const EmployeeManagement = () => {
  const [formIntance] = Form.useForm();
  const [listEmployee, setListEmployee] = useState([]);

  useEffect(() => {
    const fetchAllEmployee = async () => {
      const res = await getAllEmployee({});
      setListEmployee(res?.data);
    };
    fetchAllEmployee();
  }, []);

  const handleSearch = async () => {
    const payload = {
      firstName: formIntance.getFieldValue("firstName"),
      lastName: formIntance.getFieldValue("lastName"),
      phoneNumber: formIntance.getFieldValue("phoneNumber"),
      position: formIntance.getFieldValue("position"),
    };
    const res = await getAllEmployee(payload);
    setListEmployee(res?.data);
  };

  const columns = [
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
      render: (value) => (value === true ? "ACTIVE" : "INACTIVE"),
    },
    {
      title: "Người tạo",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "createdAt",
      render: (value) =>
        value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
    },
    {
      title: "Người cập nhật",
      dataIndex: "updated_by",
      key: "updatedBy",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      key: "updatedAt",
      render: (value) =>
        value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <i
          className="fa-regular fa-pen-to-square"
          style={{
            color: VietBusTheme.primary,
            fontSize: 18,
            cursor: "pointer",
          }}
          // onClick={() => handleEdit(record)}
        />
      ),
    },
  ];

  return (
    <div>
      <Card>
        <h2>Search area</h2>
        <Form form={formIntance}>
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
                <Select
                  placeholder="Chọn chức vụ"
                  options={[
                    { value: "ADMIN", label: "Admin" },
                    { value: "STAFF", label: "Nhân viên" },
                    { value: "DRIVER", label: "Tài xế" },
                    { value: "MANAGER", label: "Quản lý" },
                  ]}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={8}>
            <Col>
              <Button
                htmlType="reset"
                onClick={() => formIntance.resetFields()}
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
      <Table className="pt-4" dataSource={listEmployee} columns={columns} />
    </div>
  );
};

export default EmployeeManagement;
