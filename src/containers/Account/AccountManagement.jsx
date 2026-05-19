import { Button, Card, Col, Form, Input, Row, Select, Spin, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { getAllAccount } from "../../services/AccountService";
import { VietBusTheme } from "../../constants/VietBusTheme";
import { useAuth } from "../../context/AuthContext";
import AddAccountModal from "./Modal/AddAccountModal";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../constants/Constants.js";
import UpdateAccountModal from "./Modal/UpdateAccountModal";
import { formatDateTime } from "../../utils/Utils.js";
import { EditOutlined } from "@ant-design/icons";

const AccountManagement = () => {
  const { user } = useAuth();
  const [formInstance] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [listAccount, setListAccount] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const fetchAllAccount = async (payload = {}) => {
    try {
      setIsLoading(true);
      const res = await getAllAccount(payload);
      setListAccount(res?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAccount();
  }, []);

  const handleSearch = async () => {
    const payload = formInstance.getFieldsValue();
    await fetchAllAccount(payload);
  };

  const ROLE_MAP = useMemo(
    () =>
      Object.fromEntries(ROLE_OPTIONS.map((item) => [item.value, item.label])),
    [],
  );

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
        title: "Tên đăng nhập",
        dataIndex: "username",
        key: "username",
        align: "center",
        sorter: (a, b) => a.username.localeCompare(b.username),
      },
      {
        title: "Vai trò",
        dataIndex: "role",
        key: "role",
        align: "center",
        render: (value) => <span>{ROLE_MAP[value] || value}</span>,
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
        title: "Thao tác",
        key: "action",
        align: "center",
        render: (_, record) => (
          <div className="flex justify-evenly">
            <EditOutlined
              style={{
                color: VietBusTheme.primary,
                fontSize: 18,
                cursor: "pointer",
              }}
              title="Cập nhật"
              onClick={() => {
                setSelectedAccount(record);
                setOpenUpdateModal(true);
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
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
      <Table
        rowKey="username"
        loading={isLoading}
        className="pt-4"
        dataSource={listAccount}
        columns={columns}
      />
      {/* ADD Account Modal */}
      <AddAccountModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={() => {
          fetchAllAccount();
        }}
      />
      {/* UPDATE Account Modal */}
      <UpdateAccountModal
        open={openUpdateModal}
        account={selectedAccount}
        onClose={() => {
          setOpenUpdateModal(false);
          setSelectedAccount(null);
        }}
        onSuccess={() => {
          fetchAllAccount();
        }}
      />
    </>
  );
};

export default AccountManagement;
