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
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { useEffect, useState } from "react";
import {
  PAYMENT_METHOD_OPTION,
  TICKET_STATUS_OPTION,
} from "../../../constants/Constants";
import { updateTicket } from "../../../services/TicketService";
import { getApiErrorMessage } from "../../../utils/Utils";

const UpdatePendingTicketModal = ({ ticket, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ticket && open) {
      form.setFieldsValue({
        ticketCode: ticket?.ticketCode,
        tripCode: ticket?.tripCode,
        ticketStatus: ticket?.ticketStatus,
        paymentMethod: ticket?.ticketPaymentMethod,
      });
    }
  }, [ticket, open, form]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      // Check if there are any changes
      const isChanged =
        values.ticketStatus !== ticket?.ticketStatus ||
        values.paymentMethod !== ticket?.paymentMethod;

      if (!isChanged) {
        message.warning("Không có thay đổi nào để cập nhật");
        setIsLoading(false);
        return;
      }

      const payload = {
        ticketCode: values.ticketCode,
        tripCode: values.tripCode,
        ticketStatus: values.ticketStatus,
        paymentMethod: values.paymentMethod,
      };

      await updateTicket(payload);
      message.success("Cập nhật thành công");
      onSuccess();
      onClose();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

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
            CẬP NHẬT VÉ
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
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
              <EditOutlined /> Thông tin trạng thái vé
            </h3>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Mã vé</span>}
                  name="ticketCode"
                >
                  <Input size="large" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Mã chuyến</span>}
                  name="tripCode"
                >
                  <Input size="large" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Trạng thái vé</span>}
                  name="ticketStatus"
                >
                  <Select size="large" options={TICKET_STATUS_OPTION} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Phương thức thanh toán</span>}
                  name="paymentMethod"
                >
                  <Select size="large" options={PAYMENT_METHOD_OPTION} disabled />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex justify-end gap-3 pb-2">
            <Button
              size="large"
              className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
              onClick={onClose}
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
              loading={isLoading}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UpdatePendingTicketModal;
