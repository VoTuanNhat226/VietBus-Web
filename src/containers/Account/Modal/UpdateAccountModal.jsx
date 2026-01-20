import { Button, Col, Form, Modal, Row, Select } from "antd";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../../constants/Contans";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { useEffect } from "react";

const UpdateAccountModal = ({ account, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  console.log(account);

  useEffect(() => {
    if (account && open) {
      form.setFieldsValue({
        role: account?.role,
        active: account?.active,
      });
    }
  }, [account, open, form]);

  return (
    <Modal
      title="Cập nhật tài khoản"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Select options={ROLE_OPTIONS} />{" "}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Trạng thái"
              name="active"
              rules={[{ required: true }]}
            >
              <Select options={ACTIVE_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Đóng</Button>
          <Button
            type="primary"
            style={{
              backgroundColor: VietBusTheme.primary,
              color: VietBusTheme.white,
            }}
            // onClick={handleSubmit}
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateAccountModal;
