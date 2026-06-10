import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  message,
} from "antd";
import {
  CloseOutlined,
  UserOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../../constants/Constants.js";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../../utils/Utils.js";
import { changePassword } from "../../../services/AccountService.js";

const AccountDetailModal = ({ user, open, onClose }) => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        message.error("Mật khẩu mới không khớp!");
        return;
      }
      setIsChangingPassword(true);
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success("Đổi mật khẩu thành công!");
      setOpenChangePassword(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error(error?.response?.data?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    if (user && open) {
      setIsLoading(true);
      setTimeout(() => {
        form.setFieldsValue({
          username: user.username,
          role: user.role,
        });
        setIsLoading(false);
      }, 300);
    }
  }, [user, open, form]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 pb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ backgroundColor: `${VietBusTheme.primary}20` }}
          >
            <UserOutlined
              style={{ color: VietBusTheme.primary, fontSize: "16px" }}
            />
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-wide uppercase">
            CHI TIẾT TÀI KHOẢN
          </span>
        </div>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={700}
      centered
      className="rounded-xl overflow-hidden"
      closeIcon={
        <div className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors flex items-center justify-center">
          <CloseOutlined className="text-gray-500 text-sm" />
        </div>
      }
      destroyOnClose
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" form={form}>
          <div className="mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2 text-base">
              <InfoCircleOutlined /> Thông tin cơ bản
            </h3>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Tên đăng nhập
                    </span>
                  }
                  name="username"
                >
                  <Input size="large" readOnly className="bg-gray-50" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">Vai trò</span>
                  }
                  name="role"
                >
                  <Select
                    options={ROLE_OPTIONS}
                    size="large"
                    disabled
                    className="bg-gray-50"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="flex justify-end gap-3 pb-2">
            <Button
              type="primary"
              size="large"
              className="px-6 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
              style={{
                backgroundColor: VietBusTheme.primary,
                borderColor: VietBusTheme.primary,
                color: VietBusTheme.white,
              }}
              onClick={() => setOpenChangePassword(true)}
            >
              Đổi mật khẩu
            </Button>
            <Button
              size="large"
              className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
              onClick={() => {
                form.resetFields();
                onClose();
              }}
            >
              Đóng
            </Button>
          </div>
        </Form>
      </Spin>

      <Modal
        title={
          <div className="flex items-center gap-2 pb-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ backgroundColor: `${VietBusTheme.primary}20` }}
            >
              <LockOutlined
                style={{ color: VietBusTheme.primary, fontSize: "16px" }}
              />
            </div>
            <span className="text-lg font-bold text-gray-800 tracking-wide uppercase">
              ĐỔI MẬT KHẨU
            </span>
          </div>
        }
        open={openChangePassword}
        onCancel={() => {
          setOpenChangePassword(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={500}
        centered
        className="rounded-xl overflow-hidden"
        closeIcon={
          <div className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors flex items-center justify-center">
            <CloseOutlined className="text-gray-500 text-sm" />
          </div>
        }
        destroyOnClose
      >
        <Spin spinning={isChangingPassword}>
          <Form form={passwordForm} layout="vertical">
            <div className="mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">
                    Mật khẩu hiện tại
                  </span>
                }
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu hiện tại!",
                  },
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">
                    Mật khẩu mới
                  </span>
                }
                name="newPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">
                    Nhập lại mật khẩu mới
                  </span>
                }
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lại mật khẩu mới!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu mới không khớp!"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>
            </div>
            <div className="flex justify-end gap-3 pb-2">
              <Button
                size="large"
                className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
                onClick={() => {
                  setOpenChangePassword(false);
                  passwordForm.resetFields();
                }}
              >
                Hủy Bỏ
              </Button>
              <Button
                type="primary"
                size="large"
                className="px-8 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                style={{
                  backgroundColor: VietBusTheme.primary,
                  borderColor: VietBusTheme.primary,
                  color: VietBusTheme.white,
                }}
                loading={isChangingPassword}
                onClick={handleChangePassword}
              >
                Xác nhận
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </Modal>
  );
};

export default AccountDetailModal;
