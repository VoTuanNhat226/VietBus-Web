import { Button, Col, Form, message, Modal, Row, Select } from "antd";
import { useEffect } from "react";
import { STATUS_TRIP_OPTIONS } from "../../../constants/Constants";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { updateTrip } from "../../../services/TripService";
import { getApiErrorMessage } from "../../../utils/Utils";

const UpdateTripModal = ({ trip, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (trip && open) {
      form.setFieldsValue({
        status: trip?.status,
      });
    }
  }, [trip, open]);

  const handleSubmit = async () => {
    try {
      const payload = {
        tripId: trip?.tripId,
        status: form.getFieldValue("status"),
      };
      await updateTrip(payload);
      message.success("Cập nhật thành công");
      onSuccess();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    }
  };

  return (
    <Modal
      title="CẬP NHẬT CHUYẾN XE"
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="status">
              <Select options={STATUS_TRIP_OPTIONS} />
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

export default UpdateTripModal;
