import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { ACTIVE_OPTIONS } from "../../../constants/Contans";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { createRoute } from "../../../services/RouteService";
import { getApiErrorMessage } from "../../../utils/Utils";

const AddRouteModal = ({ listStation, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const payload = {
        fromStationId: form.getFieldValue("fromStationId"),
        toStationId: form.getFieldValue("toStationId"),
        distanceKm: form.getFieldValue("distanceKm"),
        durationMinutes: form.getFieldValue("durationMinutes"),
        active: form.getFieldValue("active"),
      };
      const res = await createRoute(payload);
      message.success("Tạo tuyến xe thành công");
      form.resetFields();
      onClose();
      onSuccess();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    }
  };

  return (
    <Modal
      title="TẠO TUYẾN XE"
      open={open}
      onCancel={() => {
        form.resetFields(), onClose();
      }}
      footer={null}
      width={700}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Điểm đi"
              name="fromStationId"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Select
                placeholder="Chọn điểm đi"
                options={listStation?.map((station) => ({
                  label: station.name,
                  value: station.stationId,
                }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Điểm đến"
              name="toStationId"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Select
                placeholder="Chọn điểm đến"
                options={listStation?.map((station) => ({
                  label: station.name,
                  value: station.stationId,
                }))}
              ></Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Khoảng cách (km)"
              name="distanceKm"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Input placeholder="Nhập khoảng cách"></Input>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Thời gian (phút)"
              name="durationMinutes"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Input placeholder="Nhập thời gian"></Input>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Trạng thái"
              name="active"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn trạng thái" options={ACTIVE_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              form.resetFields(), onClose();
            }}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            style={{
              backgroundColor: VietBusTheme.primary,
              color: VietBusTheme.white,
            }}
            onClick={handleSubmit}
          >
            Tạo
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddRouteModal;
