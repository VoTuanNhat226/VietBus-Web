import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllTicket } from "../../services/TicketService";
import { getAllTrip, getAllTripOpenBooking } from "../../services/TripService";
import { Button, Card, Col, Form, Input, Row, Select, Table, Tag } from "antd";
import {
  PAYMENT_METHOD_OPTION,
  PAYMENT_TYPE_OPTION,
  TICKET_STATUS_OPTION,
} from "../../constants/Constants";
import { VietBusTheme } from "../../constants/VietBusTheme";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { useNavigate } from "react-router-dom";
import AddTicketModal from "./Modal/AddTicketModal";
import TicketDetailModal from "./Modal/TicketDetailModal";
import { DoubleRightOutlined, EyeOutlined } from "@ant-design/icons";

const TicketManagement = () => {
  const { user } = useAuth();
  const { setTitle } = usePageTitle();
  const navigate = useNavigate();
  const [formInstance] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const [listTicket, setListTicket] = useState([]);
  const [listTrip, setListTrip] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTripForAdd, setSelectedTripForAdd] = useState(null);

  const fetchTickets = async (payload = {}) => {
    try {
      setIsLoading(true);
      const res = await getAllTicket(payload);
      setListTicket(res?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const fetchTrips = async () => {
      const res = await getAllTrip({});
      setListTrip(res?.data || []);
    };
    fetchTrips();
  }, []);

  const handleSearch = async () => {
    const payload = formInstance.getFieldsValue();
    fetchTickets(payload);
  };

  const ticketStatusMap = useMemo(() => {
    return Object.fromEntries(
      TICKET_STATUS_OPTION.map((item) => [item.value, item.label]),
    );
  }, []);

  const paymentTypeMap = useMemo(() => {
    return Object.fromEntries(
      PAYMENT_TYPE_OPTION.map((item) => [item.value, item.label]),
    );
  }, []);

  const paymentMethodMap = useMemo(() => {
    return Object.fromEntries(
      PAYMENT_METHOD_OPTION.map((item) => [item.value, item.label]),
    );
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "index",
        width: 60,
        align: "center",
        render: (_text, _record, index) => index + 1,
      },
      {
        title: "Mã vé",
        dataIndex: "ticketCode",
        key: "ticketCode",
        align: "center",
      },
      {
        title: "Mã chuyến",
        dataIndex: "tripCode",
        key: "tripCode",
        align: "center",
      },
      {
        title: "Khách hàng",
        dataIndex: "passengerName",
        key: "passengerName",
        align: "center",
      },
      {
        title: "Số điện thoại",
        dataIndex: "passengerPhone",
        key: "passengerPhone",
        align: "center",
      },
      {
        title: "Giá vé",
        dataIndex: "ticketPrice",
        key: "ticketPrice",
        align: "center",
        render: (price) =>
          `${new Intl.NumberFormat("vi-VN").format(price)} VNĐ`,
      },
      {
        title: "Trạng thái",
        dataIndex: "ticketStatus",
        key: "ticketStatus",
        align: "center",
        render: (status) => {
          let color = "default";
          if (status === "PAID") color = "success";
          if (status === "UNPAID") color = "warning";
          return <Tag color={color}>{ticketStatusMap[status] || status}</Tag>;
        },
      },
      {
        title: "Hình thức",
        dataIndex: "ticketPaymentType",
        key: "ticketPaymentType",
        align: "center",
        render: (type) => paymentTypeMap[type] || type,
      },
      {
        title: "Phương thức",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        align: "center",
        render: (method) => paymentMethodMap[method] || method || "-",
      },
      {
        title: "Số ghế",
        dataIndex: "seatNumber",
        key: "seatNumber",
        align: "center",
      },
      {
        title: "Người bán",
        dataIndex: "ticketSoldBy",
        key: "ticketSoldBy",
        align: "center",
      },
      {
        title: "Thao tác",
        key: "action",
        align: "center",
        render: (_, record) => (
          <div className="flex justify-evenly gap-2">
            <EyeOutlined
              style={{
                color: VietBusTheme.primary,
                fontSize: 18,
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedTicket(record);
                setOpenDetailModal(true);
              }}
              title="Xem chi tiết"
            />
            <DoubleRightOutlined
              style={{
                color: VietBusTheme.primary,
                fontSize: 18,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/trip/${record.tripId}`)}
              title="Xem chuyến xe"
            />
          </div>
        ),
      },
    ],
    [paymentTypeMap, ticketStatusMap, paymentMethodMap],
  );

  return (
    <>
      <Card>
        <h2>Search area</h2>
        <Form form={formInstance} layout="vertical">
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <Form.Item name="ticketCode">
                <Input placeholder="Nhập mã vé" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="tripCode">
                <Input placeholder="Nhập mã chuyến" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="tripId">
                <Select
                  showSearch
                  placeholder="Chọn chuyến xe"
                  options={listTrip.map((t) => ({
                    label: `${t.tripCode} (${t.fromStation} - ${t.toStation})`,
                    value: t.tripId,
                  }))}
                  allowClear
                  onChange={(val) => {
                    const trip = listTrip.find((t) => t.tripId === val);
                    setSelectedTripForAdd(trip);
                  }}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="ticketStatus">
                <Select
                  placeholder="Chọn trạng thái"
                  options={TICKET_STATUS_OPTION}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="ticketPaymentType">
                <Select
                  placeholder="Chọn hình thức"
                  options={PAYMENT_TYPE_OPTION}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="passengerName">
                <Input placeholder="Nhập tên khách hàng" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="passengerPhone">
                <Input placeholder="Nhập số điện thoại" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={() => formInstance.resetFields()}>Reset</Button>
            </Col>
            <Col>
              <Button
                type="primary"
                style={{
                  backgroundColor: VietBusTheme.primary,
                  borderColor: VietBusTheme.primary,
                }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Table
        className="pt-4"
        rowKey="ticketId"
        loading={isLoading}
        dataSource={listTicket}
        columns={columns}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} vé`,
        }}
        scroll={{ x: 1200 }}
      />

      {/* MODALS */}
      {openAddModal && (
        <AddTicketModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={() => fetchTickets()}
          trip={selectedTripForAdd}
        />
      )}

      {openDetailModal && (
        <TicketDetailModal
          open={openDetailModal}
          onClose={() => {
            setOpenDetailModal(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
          tripStatus={listTrip.find((t) => t.tripId === selectedTicket?.tripId)?.status}
          onSuccess={() => fetchTickets()}
        />
      )}
    </>
  );
};

export default TicketManagement;
