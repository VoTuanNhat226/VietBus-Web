import { Button, Card, Col, Form, Input, Modal, Row, Spin, Table } from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import TextArea from "antd/es/input/TextArea";

const CreatePassengerModal = ({
  onConfirm,
  onCancel,
  openCreateModal,
}) => {
  const handleSubmit = () => {};
  const [form] = Form.useForm();

  return (
    <Modal
      title="THÊM HÀNH KHÁCH MỚI"
      open={openCreateModal}
      onOk={onConfirm}
      onCancel={onCancel}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Đóng</Button>
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
      }
    >
      <Spin spinning={false}>
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Input type="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số CMND/CCCD"
                name="idCardNumber"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Input inputMode="numeric" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="note" label="Ghi chú">
                <TextArea
                  rows={4}
                  placeholder="Nhập ghi chú..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreatePassengerModal;
