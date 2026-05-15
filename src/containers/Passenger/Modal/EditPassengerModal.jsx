import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  message,
  Table,
} from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { updatePassenger } from "../../../services/PassengerService";

const EditPassengerModal = ({
  onSuccess,
  onCancel,
  passenger,
  openEditModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const values = await form.validateFields();
      const payload = {
        passengerId: passenger.passengerId,
        fullName: values.fullName?.trim(),
        phoneNumber: values.phoneNumber?.trim(),
        email: values.email?.trim().toLowerCase(),
        idCardNumber: values.idCardNumber?.trim(),
        note: values.note || "",
      };

      await updatePassenger(payload);
      message.success("Cập nhật hành khách thành công");
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error("Error occurred while submitting form:", error);
      message.error("Có lỗi xảy ra khi cập nhật hành khách. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (passenger) {
      form.setFieldsValue(passenger);
    }
  }, [passenger]);

  return (
    <Modal
      title={
        <div style={{ color: VietBusTheme.primary, fontSize: "20px" }}>
          CẬP NHẬT THÔNG TIN KHÁCH HÀNG
        </div>
      }
      open={openEditModal}
      onOk={handleSubmit}
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
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Input disabled={true} />
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

export default EditPassengerModal;
