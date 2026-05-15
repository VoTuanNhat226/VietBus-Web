import {
  Button,
  Col,
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

  return (
    <Modal
      title={
        <div style={{ color: VietBusTheme.primary, fontSize: "20px" }}>
          TẠO TÀI KHOẢN
        </div>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={700}
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vai trò"
                name="role"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Select
                  placeholder="Chọn vai trò"
                  options={ROLE_OPTIONS}
                ></Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Bắt buộc" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="active"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Select
                  placeholder="Chọn trạng thái"
                  options={ACTIVE_OPTIONS}
                />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                form.resetFields();
                onClose();
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: VietBusTheme.primary,
                color: VietBusTheme.white,
              }}
              onClick={handleSubmit}
            >
              Tạo
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddAccountModal;
