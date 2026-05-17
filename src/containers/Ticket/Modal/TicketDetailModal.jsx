import { Modal, Descriptions, Tag, Button, Divider } from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { formatDateTime, formatVND } from "../../../utils/Utils";
import {
  TICKET_STATUS_OPTION,
  PAYMENT_TYPE_OPTION,
} from "../../../constants/Constants";
import moment from "moment";

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
      <Tag color={color} style={{ borderRadius: "12px", padding: "0 10px" }}>
        {ticketStatusMap[status] || status}
      </Tag>
    );
  };

  return (
    <Modal
      title={
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: VietBusTheme.primary,
          }}
        >
          <i className="fa-solid fa-ticket-simple mr-2" /> CHI TIẾT VÉ
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} style={{ borderRadius: "6px" }}>
          Đóng
        </Button>,
      ]}
      width={760}
      centered
      styles={{
        header: {
          borderBottom: `1px solid ${VietBusTheme.lightGrey}`,
          paddingBottom: "10px",
          marginBottom: "20px",
        },
      }}
    >
      <div className="ticket-detail-content">
        <Descriptions
          bordered
          column={2}
          size="middle"
          labelStyle={{
            fontWeight: "600",
            width: "180px",
            background: "#f9f9f9",
          }}
          contentStyle={{ background: "#fff" }}
        >
          <Descriptions.Item label="Mã vé" span={1}>
            <span
              style={{
                fontWeight: "bold",
                color: VietBusTheme.primary,
                fontSize: "16px",
              }}
            >
              {ticket.ticketCode}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái" span={1}>
            {getStatusTag(ticket.ticketStatus)}
          </Descriptions.Item>

          <Descriptions.Item label="Mã chuyến" span={1}>
            <span style={{ fontWeight: "500" }}>{ticket.tripCode}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Số ghế" span={1}>
            <Tag color="geekblue" style={{ fontWeight: "bold" }}>
              {ticket.seatNumber}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Tuyến đường" span={2}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: "500" }}>{ticket.fromStation}</span>
              <i
                className="fa-solid fa-arrow-right-long"
                style={{ color: VietBusTheme.primary }}
              />
              <span style={{ fontWeight: "500" }}>{ticket.toStation}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Giá vé" span={1}>
            <span style={{ color: "#d4380d", fontWeight: "bold" }}>
              {formatVND(ticket.ticketPrice)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Hình thức" span={1}>
            {paymentTypeMap[ticket.ticketPaymentType] ||
              ticket.ticketPaymentType}
          </Descriptions.Item>

          <Descriptions.Item label="Khách hàng" span={1}>
            <i className="fa-solid fa-user mr-2" style={{ color: "#8c8c8c" }} />
            {ticket.passengerName}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại" span={1}>
            <i
              className="fa-solid fa-phone mr-2"
              style={{ color: "#8c8c8c" }}
            />
            {ticket.passengerPhone}
          </Descriptions.Item>

          <Descriptions.Item label="Ghi chú khách hàng" span={2}>
            {ticket.passengerNote || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Người bán" span={1}>
            {ticket.ticketSoldBy}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian bán" span={1}>
            {ticket.ticketSoldAt ? formatDateTime(ticket.ticketSoldAt) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú vé" span={2}>
            {ticket.ticketNote || "-"}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default TicketDetailModal;
