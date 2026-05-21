import {
  CloseOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import { useEffect, useState } from "react";

import { STATUS_TRIP_OPTIONS } from "../../../constants/Constants";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { updateTrip } from "../../../services/TripService";
import { getApiErrorMessage } from "../../../utils/Utils";

const UpdateTripModal = ({ trip, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (trip && open) {
      form.setFieldsValue({
        status: trip?.status,
      });
    }
  }, [trip, open, form]);

  const allowedStatusOptions = STATUS_TRIP_OPTIONS;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const currentStatus = form.getFieldValue("status");
      if (currentStatus === trip?.status) {
        message.warning("Không có thay đổi nào để cập nhật");
        setIsLoading(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  const modalTitle = (
    <div className="flex items-center gap-3 pb-3">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{
          backgroundColor: `${VietBusTheme.primary}15`,
          color: VietBusTheme.primary,
        }}
      >
        <EditOutlined className="text-xl" />
      </div>
      <span className="text-lg font-bold text-gray-800 uppercase tracking-wide">
        Cập nhật chuyến xe
      </span>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
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
          <div className="mb-4 p-4 rounded-xl border shadow-sm bg-blue-50/50 border-blue-100">
            <h3 className="text-base font-semibold mb-3 text-blue-700 flex items-center gap-2">
              <InfoCircleOutlined /> Thông tin
            </h3>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="status"
                  label={
                    <span className="font-medium text-gray-600">
                      Trạng thái chuyến xe
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái!" },
                  ]}
                >
                  <Select
                    size="large"
                    options={allowedStatusOptions}
                    placeholder="Chọn trạng thái"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              size="large"
              className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
              onClick={onClose}
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              size="large"
              className="px-8 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              style={{
                backgroundColor: VietBusTheme.primary,
                borderColor: VietBusTheme.primary,
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

export default UpdateTripModal;
