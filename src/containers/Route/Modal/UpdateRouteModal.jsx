import { Button, Col, Form, message, Modal, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { updateRoute } from "../../../services/RouteService";
import { getApiErrorMessage } from "../../../utils/Utils";
import { ACTIVE_OPTIONS } from "../../../constants/Constants.js";
import { VietBusTheme } from "../../../constants/VietBusTheme";

const UpdateRouteModal = ({ route, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route && open) {
      form.setFieldsValue({
        active: route?.active,
      });
    }
  }, [route, open, form]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      if (values.active === route?.active) {
        message.warning("Không có thay đổi nào để cập nhật");
        setIsLoading(false);
        return;
      }

      const payload = {
        routeId: route?.routeId,
        active: values.active,
      };
      await updateRoute(payload);
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
      title="CẬP NHẬT TUYẾN XE"
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      destroyOnClose
    >
      <Spin spinning={isLoading}>
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
      </Spin>
    </Modal>
  );
};

export default UpdateRouteModal;
