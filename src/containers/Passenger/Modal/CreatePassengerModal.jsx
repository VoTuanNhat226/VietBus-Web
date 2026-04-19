import { Button, Card, Col, Form, Input, message, Modal, Row, Spin, Table } from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { createPassenger } from "../../../services/PassengerService";

const CreatePassengerModal = ({ onConfirm, onCancel, openCreateModal }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const values = await form.validateFields();
      const payload = {
        fullName: values.fullName?.trim(),
        phoneNumber: values.phoneNumber?.trim(),
        email: values.email?.trim().toLowerCase(),
        idCard: values.idCardNumber?.trim(),
        note: values.note || "",
        // hard by admin
        createdBy: "admin",
        updatedBy: "admin",
      };

      await createPassenger(payload);
      message.success("Tạo hành khách thành công");
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error("Error occurred while submitting form:", error);
      message.error("Có lỗi xảy ra khi tạo hành khách. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };
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
      <Spin spinning={isLoading}>
        <Form layout="vertical" form={form} disabled={isLoading}>
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
