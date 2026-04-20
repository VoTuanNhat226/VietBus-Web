import { Button, Col, Form, message, Modal, Row, Select } from "antd";
import { useEffect, useMemo } from "react";
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

  // Chỉ cho phép chọn trạng thái từ hiện tại trở đi (không được chọn ngược lại)
  const allowedStatusOptions = useMemo(() => {
    const currentIndex = STATUS_TRIP_OPTIONS.findIndex(
      (opt) => opt.value === trip?.status,
    );
    if (currentIndex === -1) return STATUS_TRIP_OPTIONS;
    return STATUS_TRIP_OPTIONS.slice(currentIndex);
  }, [trip?.status]);

  const handleSubmit = async () => {
    try {
      const currentStatus = form.getFieldValue("status");
      if (currentStatus === trip?.status) {
        message.warning("Trạng thái không thay đổi");
        return;
      }

      const payload = {
        tripId: trip?.tripId,
        status: currentStatus,
      };
      await updateTrip(payload);
      message.success("Cập nhật thành công");
      onSuccess();
      onClose();
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
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true }]}
            >
              <Select options={allowedStatusOptions} />
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
