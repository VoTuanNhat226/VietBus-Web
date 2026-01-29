import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { useEffect } from "react";
import {
  PAYMENT_METHOD_OPTION,
  TICKET_STATUS_OPTION,
} from "../../../constants/Constants";
import { updateTicket } from "../../../services/TicketService";
import { getApiErrorMessage } from "../../../utils/Utils";

const UpdatePendingTicketModal = ({ ticket, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (ticket && open) {
      form.setFieldsValue({
        ticketCode: ticket?.ticketCode,
        tripCode: ticket?.tripCode,
        ticketStatus: ticket?.ticketStatus,
      });
    }
  }, [ticket, open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ticketCode: values.ticketCode,
        tripCode: values.tripCode,
        ticketStatus: values.ticketStatus,
        paymentMethod: values.paymentMethod,
      };

      await updateTicket(payload);
      message.success("Cập nhật thành công");
      onSuccess();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    }
  };

  return (
    <Modal
      title="CẬP NHẬT VÉ"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Mã vé" name="ticketCode">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mã chuyến" name="tripCode">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái vé" name="ticketStatus">
              <Select options={TICKET_STATUS_OPTION} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              shouldUpdate={(prev, cur) =>
                prev.ticketStatus !== cur.ticketStatus
              }
              noStyle
            >
              {({ getFieldValue }) => {
                const isPaid = getFieldValue("ticketStatus") === "PAID";

                return (
                  <Form.Item
                    label="Phương thức thanh toán"
                    name="paymentMethod"
                    rules={
                      isPaid
                        ? [
                            {
                              required: true,
                              message: "Vui lòng chọn phương thức thanh toán",
                            },
                          ]
                        : []
                    }
                  >
                    <Select
                      options={PAYMENT_METHOD_OPTION}
                      disabled={!isPaid}
                      placeholder={
                        isPaid
                          ? "Chọn phương thức thanh toán"
                          : "Chỉ chọn khi vé đã thanh toán"
                      }
                    />
                  </Form.Item>
                );
              }}
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

export default UpdatePendingTicketModal;
