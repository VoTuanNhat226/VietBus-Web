import { CloseOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { createAccount } from "../../../services/AccountService";
import { getApiErrorMessage } from "../../../utils/Utils";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../../constants/Constants.js";
import { useState } from "react";

const AddAccountModal = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const payload = {
        username: values?.username,
        password: values?.password,
        role: values?.role,
        active: values?.active,
      };
      await createAccount(payload);
      message.success("Tạo tài khoản thành công");
      form.resetFields();
      onClose();
      onSuccess();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const modalTitle = (
    <div className="flex items-center gap-3 pb-3">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{
          backgroundColor: `${VietBusTheme.primary}15`,
          color: VietBusTheme.primary,
        }}
      >
        <UserAddOutlined className="text-xl" />
      </div>
      <span className="text-lg font-bold text-gray-800 uppercase tracking-wide">
        Tạo tài khoản
      </span>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
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
          <div className="mb-4 p-4 rounded-xl border shadow-sm bg-blue-50/50 border-blue-100">
            <h3 className="text-base font-semibold mb-3 text-blue-700 flex items-center gap-2">
              <UserAddOutlined /> Thông tin
            </h3>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Tên đăng nhập
                    </span>
                  }
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                  ]}
                >
                  <Input size="large" placeholder="Nhập tên đăng nhập" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">Vai trò</span>
                  }
                  name="role"
                  rules={[
                    { required: true, message: "Vui lòng chọn vai trò!" },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn vai trò"
                    options={ROLE_OPTIONS}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">Mật khẩu</span>
                  }
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password size="large" placeholder="Nhập mật khẩu" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Nhập lại mật khẩu
                    </span>
                  }
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp!"),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Nhập lại mật khẩu"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Trạng thái
                    </span>
                  }
                  name="active"
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái!" },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn trạng thái"
                    options={ACTIVE_OPTIONS}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              size="large"
              className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
              onClick={() => {
                form.resetFields();
                onClose();
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              size="large"
              className="px-8 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              style={{
                backgroundColor: VietBusTheme.primary,
                borderColor: VietBusTheme.primary,
              }}
              onClick={handleSubmit}
              loading={isLoading}
            >
              Tạo tài khoản
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddAccountModal;
