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
import { CloseOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { ACTIVE_OPTIONS } from "../../../constants/Constants.js";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { createRoute } from "../../../services/RouteService";
import { getApiErrorMessage } from "../../../utils/Utils";
import { useState } from "react";

const AddRouteModal = ({ listStation, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const payload = {
        fromStationId: values.fromStationId,
        toStationId: values.toStationId,
        distanceKm: values.distanceKm,
        active: values.active,
      };
      await createRoute(payload);
      message.success("Tạo tuyến xe thành công");
      form.resetFields();
      onClose();
      onSuccess();
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
            <EnvironmentOutlined
              style={{ color: VietBusTheme.primary, fontSize: "16px" }}
            />
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-wide uppercase">
            TẠO TUYẾN XE
          </span>
        </div>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
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
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" form={form}>
          <div className="mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2 text-base">
              <EnvironmentOutlined /> Thông tin tuyến xe
            </h3>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Điểm đi</span>}
                  name="fromStationId"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select
                    size="large"
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
                  label={<span className="font-medium text-gray-600">Điểm đến</span>}
                  name="toStationId"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn điểm đến"
                    options={listStation?.map((station) => ({
                      label: station.name,
                      value: station.stationId,
                    }))}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Khoảng cách (km)</span>}
                  name="distanceKm"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Input size="large" placeholder="Nhập khoảng cách"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Trạng thái</span>}
                  name="active"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn trạng thái"
                    options={ACTIVE_OPTIONS}
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
                onClose();
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
              Tạo Tuyến
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddRouteModal;
