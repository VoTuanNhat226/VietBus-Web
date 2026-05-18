import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  message,
} from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { updatePassenger } from "../../../services/PassengerService";
import { CloseOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";

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
  }, [passenger, form]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 pb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ backgroundColor: `${VietBusTheme.primary}20` }}
          >
            <EditOutlined
              style={{ color: VietBusTheme.primary, fontSize: "16px" }}
            />
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-wide uppercase">
            CẬP NHẬT HÀNH KHÁCH
          </span>
        </div>
      }
      open={openEditModal}
      onCancel={() => {
        form.resetFields();
        onCancel();
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
              <UserOutlined /> Thông tin hành khách
            </h3>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Họ và tên</span>}
                  name="fullName"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Input size="large" disabled={true} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Số điện thoại</span>}
                  name="phoneNumber"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Input size="large" maxLength={10} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Email</span>}
                  name="email"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Input size="large" type="email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Số CMND/CCCD</span>}
                  name="idCardNumber"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Input size="large" inputMode="numeric" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item 
                  name="note" 
                  label={<span className="font-medium text-gray-600">Ghi chú</span>}
                >
                  <TextArea
                    rows={4}
                    placeholder="Nhập ghi chú..."
                    showCount
                    maxLength={500}
                    className="rounded-lg p-3 text-gray-700"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex justify-end gap-3 pb-2">
            <Button
              size="large"
              className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
              onClick={() => {
                form.resetFields();
                onCancel();
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
              onClick={handleSubmit}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditPassengerModal;
