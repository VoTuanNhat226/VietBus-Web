import { Button, Col, Form, message, Modal, Row, Select } from "antd";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../../constants/Constants.js";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { useEffect } from "react";
import { updateAccount } from "../../../services/AccountService.js";

const UpdateAccountModal = ({ account, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (account && open) {
      console.log(account?.role);
      form.setFieldsValue({
        role: account?.role,
        active: account?.active,
      });
    }
  }, [account, open]);

  const handleSubmit = async () => {
    const payload = {
      accountId: account?.accountId,
      active: form.getFieldValue("active"),
    };
    await updateAccount(payload);
    message.success("Cập nhật thành công");
    onSuccess();
  };

  return (
    <Modal
      title="CẬP NHẬT TÀI KHOẢN"
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={24}>
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
            onClick={handleSubmit}
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateAccountModal;
