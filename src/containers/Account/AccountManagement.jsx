import { Button, Card, Col, Form, Input, Row, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { getAllAccount } from "../../services/AccountService";
import { VietBusTheme } from "../../constants/VietBusTheme";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import AddAccountModal from "./Modal/AddAccountModal";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../constants/Constants.js";
import UpdateAccountModal from "./Modal/UpdateAccountModal";
import { usePageTitle } from "../../context/PageTitleContext.jsx";

const AccountManagement = () => {
  const [formInstance] = Form.useForm();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [listAccount, setListAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const { user } = useAuth();

  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("QUẢN LÝ TÀI KHOẢN");
  }, []);

  useEffect(() => {
    const fetchAllAccount = async () => {
      const res = await getAllAccount({});
      setListAccount(res?.data);
    };
    fetchAllAccount();
  }, []);

  const handleSearch = async () => {
    const payload = {
      username: formInstance.getFieldValue("username"),
      role: formInstance.getFieldValue("role"),
      active: formInstance.getFieldValue("active"),
      createdBy: formInstance.getFieldValue("createdBy"),
      updatedBy: formInstance.getFieldValue("updatedBy"),
    };
    const res = await getAllAccount(payload);
    setListAccount(res?.data);
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
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      // sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      // sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      // sorter: (a, b) => Number(a.active) - Number(b.active),
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
      key: "createdBy",
      // sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      // sorter: (a, b) =>
      //   new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value) =>
        value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
    },
    {
      title: "Người cập nhật",
      dataIndex: "updatedBy",
      key: "updatedBy",
      // sorter: (a, b) => a.updatedBy.localeCompare(b.updatedBy),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      // sorter: (a, b) =>
      //   new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
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
            onClick={() => {
              setSelectedAccount(record);
              setOpenUpdateModal(true);
            }}
          />
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
              <Form.Item name="username">
                <Input placeholder="Tên đăng nhập" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="role">
                <Select placeholder="Vai trò" options={ROLE_OPTIONS}></Select>
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
            <Col span={6}>
              <Form.Item name="active">
                <Select
                  placeholder="Trạng thái"
                  options={ACTIVE_OPTIONS}
                ></Select>
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
            onClick={() => setOpenAddModal(true)}
          >
            Tạo tài khoản
          </Button>
        </div>
      ) : null}
      <Table className="pt-4" dataSource={listAccount} columns={columns} />
      {/* ADD Modal */}
      <AddAccountModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={async () => {
          const res = await getAllAccount({});
          setListAccount(res?.data);
        }}
      />
      {/* UPDATE Modal */}
      <UpdateAccountModal
        open={openUpdateModal}
        account={selectedAccount}
        onClose={() => {
          setOpenUpdateModal(false), setSelectedAccount(null);
        }}
        onSuccess={async () => {
          const res = await getAllAccount({});
          setListAccount(res?.data);
        }}
      />
    </div>
  );
};

export default AccountManagement;
