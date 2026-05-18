import {
  CloseOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Modal, Tag, Button, Form, Row, Col } from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { formatDateTime, formatVND } from "../../../utils/Utils";
import {
  TICKET_STATUS_OPTION,
  PAYMENT_TYPE_OPTION,
} from "../../../constants/Constants";

const TicketDetailModal = ({ open, onClose, ticket }) => {
  if (!ticket) return null;

  const ticketStatusMap = Object.fromEntries(
    TICKET_STATUS_OPTION.map((item) => [item.value, item.label]),
  );

  const paymentTypeMap = Object.fromEntries(
    PAYMENT_TYPE_OPTION.map((item) => [item.value, item.label]),
  );

  const getStatusTag = (status) => {
    let color = "default";
    if (status === "PAID") color = "success";
    if (status === "UNPAID") color = "warning";
    if (status === "CANCELLED") color = "error";
    return (
      <Tag
        color={color}
        className="rounded-full px-3 py-0.5 font-medium border-0"
      >
        {ticketStatusMap[status] || status}
      </Tag>
    );
  };

  const modalTitle = (
    <div className="flex items-center gap-3 pb-3">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-full"
        style={{
          backgroundColor: `${VietBusTheme.primary}20`,
        }}
      >
        <TagsOutlined
          style={{ color: VietBusTheme.primary, fontSize: "16px" }}
        />
      </div>
      <span className="text-lg font-bold text-gray-800 tracking-wide uppercase">
        CHI TIẾT VÉ
      </span>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      className="rounded-xl overflow-hidden"
      closeIcon={
        <div className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors flex items-center justify-center">
          <CloseOutlined className="text-gray-500 text-sm" />
        </div>
      }
      destroyOnClose
    >
      <Form layout="vertical">
        <div className="mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
          {/* Nhóm 1: Thông tin vé */}
          <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2 text-base">
            <InfoCircleOutlined /> Thông tin vé & thanh toán
          </h3>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<span className="font-medium text-gray-600">Mã vé</span>}
                className="mb-3"
              >
                <div className="text-lg font-bold text-blue-600">
                  {ticket.ticketCode}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">Trạng thái</span>
                }
                className="mb-3"
              >
                <div>{getStatusTag(ticket.ticketStatus)}</div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">Giá vé</span>
                }
                className="mb-3"
              >
                <div className="text-base font-bold text-red-600">
                  {formatVND(ticket.ticketPrice)}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">
                    Hình thức thanh toán
                  </span>
                }
                className="mb-3"
              >
                <div className="text-base text-gray-800 font-medium">
                  {paymentTypeMap[ticket.ticketPaymentType] ||
                    ticket.ticketPaymentType}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">Người bán</span>
                }
                className="mb-3"
              >
                <div className="text-base text-gray-800">
                  {ticket.ticketSoldBy}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">
                    Thời gian bán
                  </span>
                }
                className="mb-3"
              >
                <div className="text-base text-gray-800">
                  {ticket.ticketSoldAt
                    ? formatDateTime(ticket.ticketSoldAt)
                    : "-"}
                </div>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">Ghi chú vé</span>
                }
                className="mb-0"
              >
                <div className="text-base text-gray-800">
                  {ticket.ticketNote || "-"}
                </div>
              </Form.Item>
            </Col>
          </Row>

          {/* Nhóm 2: Thông tin chuyến đi */}
          <h3 className="text-blue-800 font-semibold mb-3 mt-4 flex items-center gap-2 text-base">
            <EnvironmentOutlined /> Thông tin hành trình
          </h3>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">
                    Mã chuyến xe
                  </span>
                }
                className="mb-3"
              >
                <div className="text-base font-medium text-gray-800">
                  {ticket.tripCode}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">Số ghế</span>
                }
                className="mb-3"
              >
                <Tag
                  color="geekblue"
                  className="text-sm font-bold px-3 py-0.5 rounded-full border-0"
                >
                  {ticket.seatNumber}
                </Tag>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">Tuyến đường</span>
                }
                className="mb-0"
              >
                <div className="flex items-center gap-2 text-base font-medium text-gray-800">
                  <span>{ticket.fromStation}</span>
                  <i className="fa-solid fa-arrow-right-long text-emerald-600" />
                  <span>{ticket.toStation}</span>
                </div>
              </Form.Item>
            </Col>
          </Row>

          {/* Nhóm 3: Thông tin khách hàng */}
          <h3 className="text-blue-800 font-semibold mb-3 mt-4 flex items-center gap-2 text-base">
            <UserOutlined /> Thông tin hành khách
          </h3>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">Khách hàng</span>
                }
                className="mb-3"
              >
                <div className="text-base font-medium text-gray-800 flex items-center gap-2">
                  <i className="fa-solid fa-user text-gray-400" />
                  {ticket.passengerName}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">
                    Số điện thoại
                  </span>
                }
                className="mb-3"
              >
                <div className="text-base font-medium text-gray-800 flex items-center gap-2">
                  <i className="fa-solid fa-phone text-gray-400" />
                  {ticket.passengerPhone}
                </div>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={
                  <span className="font-medium text-gray-600">
                    Ghi chú khách hàng
                  </span>
                }
                className="mb-0"
              >
                <div className="text-base text-gray-800">
                  {ticket.passengerNote || "-"}
                </div>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="flex justify-end gap-3 pb-2">
          <Button
            size="large"
            className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TicketDetailModal;
