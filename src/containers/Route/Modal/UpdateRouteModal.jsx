import { Button, Col, Form, message, Modal, Row, Select } from "antd";
import { useEffect } from "react";
import { updateRoute } from "../../../services/RouteService";
import { getApiErrorMessage } from "../../../utils/Utils";
import { ACTIVE_OPTIONS } from "../../../constants/Constants.js";
import { VietBusTheme } from "../../../constants/VietBusTheme";

const UpdateRouteModal = ({ route, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (route && open) {
      form.setFieldsValue({
        active: route?.active,
      });
    }
  }, [route, open, form]);

  const handleSubmit = async () => {
    try {
      const payload = {
        routeId: route?.routeId,
        active: form.getFieldValue("active"),
      };
      const res = await updateRoute(payload);
      message.success("Cập nhật thành công");
      onSuccess?.();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    }
  };

  return (
    <Modal
      title="CẬP NHẬT TUYẾN XE"
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
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
          >
            Đóng
          </Button>
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

export default UpdateRouteModal;
