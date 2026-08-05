import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import { CloseOutlined, ToolOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import moment from "moment";
import {
  createVehicleMaintenance,
  updateVehicleMaintenance,
} from "../../../services/VehicleMaintenanceService";
import { getApiErrorMessage } from "../../../utils/Utils";
import {
  MAINTENANCE_STATUS_OPTIONS,
  MAINTENANCE_TYPE_OPTIONS,
} from "../../../constants/Constants";
import { VietBusTheme } from "../../../constants/VietBusTheme";

const { TextArea } = Input;

const VehicleMaintenanceModal = ({
  open,
  onClose,
  onSuccess,
  vehicleId,
  record,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isUpdateMode = !!record;

  useEffect(() => {
    if (open) {
      if (record) {
        form.setFieldsValue({
          maintenanceType: record.maintenanceType,
          status: record.status,
          maintenanceDate: record.maintenanceDate
            ? moment(record.maintenanceDate)
            : null,
          odometerKm: record.odometerKm,
          cost: record.cost,
          garageName: record.garageName,
          performedBy: record.performedBy,
          nextMaintenanceDate: record.nextMaintenanceDate
            ? moment(record.nextMaintenanceDate)
            : null,
          nextMaintenanceKm: record.nextMaintenanceKm,
          description: record.description,
          invoiceUrl: record.invoiceUrl,
        });
      } else {
        form.resetFields();
      }
    }
  }, [record, open, form]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const payload = {
        vehicleId,
        maintenanceType: values.maintenanceType,
        status: values.status,
        maintenanceDate: values.maintenanceDate
          ? values.maintenanceDate.format("YYYY-MM-DD")
          : null,
        odometerKm: values.odometerKm,
        cost: values.cost,
        garageName: values.garageName,
        performedBy: values.performedBy,
        nextMaintenanceDate: values.nextMaintenanceDate
          ? values.nextMaintenanceDate.format("YYYY-MM-DD")
          : null,
        nextMaintenanceKm: values.nextMaintenanceKm,
        description: values.description,
        invoiceUrl: values.invoiceUrl,
      };

      if (isUpdateMode) {
        payload.id = record.id;
        await updateVehicleMaintenance(payload);
        message.success("Cập nhật lịch sử bảo trì thành công");
      } else {
        await createVehicleMaintenance(payload);
        message.success("Thêm lịch sử bảo trì thành công");
      }

      form.resetFields();
      onSuccess();
      onClose();
    } catch (err) {
      if (err?.errorFields) return; // lỗi validate form, không cần toast
      message.error(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 pb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ backgroundColor: `${VietBusTheme.primary}20` }}
          >
            <ToolOutlined
              style={{ color: VietBusTheme.primary, fontSize: "16px" }}
            />
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-wide uppercase">
            {isUpdateMode ? "Chi tiết lịch sử bảo trì" : "Thêm lịch sử bảo trì"}
          </span>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
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
              <ToolOutlined /> Thông tin bảo trì
            </h3>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Loại</span>}
                  name="maintenanceType"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn loại bảo trì"
                    options={MAINTENANCE_TYPE_OPTIONS}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Trạng thái</span>}
                  name="status"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn trạng thái"
                    options={MAINTENANCE_STATUS_OPTIONS}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Ngày thực hiện</span>}
                  name="maintenanceDate"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    format="DD-MM-YYYY"
                    placeholder="Chọn ngày"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Số km tại thời điểm sửa</span>}
                  name="odometerKm"
                >
                  <InputNumber
                    size="large"
                    className="w-full"
                    min={0}
                    placeholder="Nhập số km"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Chi phí (VNĐ)</span>}
                  name="cost"
                >
                  <InputNumber
                    size="large"
                    className="w-full"
                    min={0}
                    placeholder="Nhập chi phí"
                    formatter={(value) =>
                      value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                    }
                    parser={(value) => value?.replace(/,/g, "")}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Ga-ra / Đơn vị sửa chữa</span>}
                  name="garageName"
                >
                  <Input size="large" placeholder="Nhập tên ga-ra" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Người thực hiện</span>}
                  name="performedBy"
                >
                  <Input size="large" placeholder="Nhập người phụ trách" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Link hóa đơn/ảnh</span>}
                  name="invoiceUrl"
                >
                  <Input size="large" placeholder="Dán link hóa đơn (nếu có)" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Ngày bảo trì tiếp theo</span>}
                  name="nextMaintenanceDate"
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    format="DD-MM-YYYY"
                    placeholder="Chọn ngày (nếu có)"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Km bảo trì tiếp theo</span>}
                  name="nextMaintenanceKm"
                >
                  <InputNumber
                    size="large"
                    className="w-full"
                    min={0}
                    placeholder="Nhập số km (nếu có)"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Mô tả</span>}
                  name="description"
                >
                  <TextArea rows={3} placeholder="Nhập mô tả nội dung sửa chữa/bảo dưỡng" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex justify-end gap-3 pb-2">
            <Button
              size="large"
              className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
              onClick={handleClose}
            >
              Đóng
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
              Lưu
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default VehicleMaintenanceModal;
