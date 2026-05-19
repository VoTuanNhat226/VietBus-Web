import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Divider,
} from "antd";
import {
  UserOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  TagsOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getListTripSeatAvailableByTripId } from "../../../services/TripSeatService";
import TextArea from "antd/es/input/TextArea";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { formatVND, getApiErrorMessage } from "../../../utils/Utils";
import { PAYMENT_METHOD_OPTION } from "../../../constants/Constants";
import { createTicket } from "../../../services/TicketService";
import { getAllPassenger } from "../../../services/PassengerService";

const AddTicketModal = ({
  open,
  onClose,
  onSuccess,
  trip,
  fetchTripById,
  initialSeatId,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [listPassenger, setListPassenger] = useState([]);
  const [listTripSeatCanSell, setListTripSeatCanSell] = useState([]);

  useEffect(() => {
    const selectedTripId = trip?.tripId;
    if (!selectedTripId) return;

    form.setFieldsValue({
      tripId: trip?.tripId,
      tripPrice: formatVND(trip?.price),
    });

    if (initialSeatId) {
      form.setFieldValue("tripSeatId", initialSeatId);
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [tripSeats, passengers] = await Promise.all([
          getListTripSeatAvailableByTripId({
            tripId: selectedTripId,
          }),
          getAllPassenger({}),
        ]);

        const seatOptions = (tripSeats?.data || [])
          .sort((a, b) =>
            a.seatNumber.localeCompare(b.seatNumber, undefined, {
              numeric: true,
              sensitivity: "base",
            }),
          )
          .map((item) => ({
            value: item.tripSeatId,
            label: item.seatNumber,
          }));

        setListTripSeatCanSell(seatOptions);

        if (passengers?.statusCode === 200) {
          const passengerOptions = (passengers.data || []).map((item) => ({
            value: item.passengerId,
            label: `${item.fullName} - ${item.phoneNumber}`,
          }));

          setListPassenger(passengerOptions);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [trip?.tripId, initialSeatId, form]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const payload = {
        tripId: trip?.tripId,
        passengerId: values.passengerId || null,
        tripSeatId: values.tripSeatId,
        ticketPrice: values.ticketPrice,
        paymentType: values.paymentType,
        paymentMethod: values.paymentMethod,
        note: values.note,
      };
      await createTicket(payload);
      message.success("Tạo vé thành công");
      form.resetFields();
      onClose();
      fetchTripById && fetchTripById();
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
            <TagsOutlined
              style={{ color: VietBusTheme.primary, fontSize: "16px" }}
            />
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-wide">
            TẠO VÉ MỚI
          </span>
        </div>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={780}
      centered
      closeIcon={
        <div className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors flex items-center justify-center">
          <CloseOutlined className="text-gray-500 text-sm" />
        </div>
      }
      className="rounded-xl overflow-hidden"
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" form={form} disabled={isLoading}>
          <div className="mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
            {/* Section 1: Thông tin khách hàng & Chỗ ngồi */}
            <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2 text-base">
              <UserOutlined /> Thông tin Khách hàng & Chỗ ngồi
            </h3>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="passengerId"
                  label={
                    <span className="font-medium text-gray-600">
                      Khách hàng
                    </span>
                  }
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={listPassenger}
                    placeholder="Chọn khách hàng"
                    size="large"
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tripSeatId"
                  label={
                    <span className="font-medium text-gray-600">
                      Giường / Ghế
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng chọn chỗ ngồi!" },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={listTripSeatCanSell}
                    placeholder="Chọn giường/ghế"
                    size="large"
                    disabled={!!initialSeatId}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* Section 2: Thông tin thanh toán */}
            <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2 text-base">
              <CreditCardOutlined /> Chi tiết Thanh toán
            </h3>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="tripPrice"
                  label={
                    <span className="font-medium text-gray-600">
                      Giá niêm yết
                    </span>
                  }
                >
                  <Input
                    disabled={true}
                    size="large"
                    className="bg-gray-100 text-gray-500 font-semibold"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ticketPrice"
                  label={
                    <span className="font-medium text-gray-600">
                      Giá bán thực tế
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập giá bán!" },
                  ]}
                >
                  <Input
                    placeholder="Nhập giá vé bán ra"
                    size="large"
                    className="font-semibold text-emerald-600"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="paymentType"
                  label={
                    <span className="font-medium text-gray-600">
                      Hình thức thanh toán
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng chọn hình thức!" },
                  ]}
                >
                  <Radio.Group className="flex gap-4">
                    <Radio value="PAY_NOW" className="font-medium">
                      Trả ngay
                    </Radio>
                    <Radio value="PAY_LATER" className="font-medium">
                      Trả sau
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="paymentMethod"
                  label={
                    <span className="font-medium text-gray-600">
                      Phương thức thanh toán
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phương thức!",
                    },
                  ]}
                >
                  <Select
                    options={PAYMENT_METHOD_OPTION}
                    placeholder="Chọn phương thức"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* Section 3: Ghi chú */}
            <h3 className="text-blue-700 font-semibold mb-3 flex items-center gap-2 text-base">
              <FileTextOutlined /> Ghi chú bổ sung
            </h3>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item name="note" className="mb-0">
                  <TextArea
                    rows={3}
                    placeholder="Nhập bất kỳ ghi chú nào cho vé này..."
                    showCount
                    maxLength={500}
                    className="rounded-lg p-3 text-gray-700"
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
              Tạo Vé
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddTicketModal;
