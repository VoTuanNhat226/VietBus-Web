import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePageTitle } from "../../context/PageTitleContext";
import { getAllTicketsUnpaid } from "../../services/TicketService";
import { Button, Card, Col, Form, Input, Row, Select, Table } from "antd";
import {
  PAYMENT_TYPE_OPTION,
  TICKET_STATUS_OPTION,
} from "../../constants/Constants";
import { VietBusTheme } from "../../constants/VietBusTheme";

const PendingTicket = () => {
  const [formInstance] = Form.useForm();

  const [listPendingTicket, setListPendingTicket] = useState([]);
  const { user } = useAuth();

  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("VÉ CHƯA THANH TOÁN");
  }, []);

  useEffect(() => {
    const fetchPendingTicket = async () => {
      const res = await getAllTicketsUnpaid({});
      setListPendingTicket(res?.data);
    };
    fetchPendingTicket();
  }, []);

  const handleSearch = async () => {
    const payload = {
      ticketCode: formInstance.getFieldValue("ticketCode"),
      tripCode: formInstance.getFieldValue("tripCode"),
      ticketPaymentType: formInstance.getFieldValue("ticketPaymentType"),
      ticketSoldBy: formInstance.getFieldValue("ticketSoldBy"),
    };
    const res = await getAllTicketsUnpaid(payload);
    setListPendingTicket(res?.data);
  };

  const columns = [
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
    },
    {
      title: "Mã chuyến",
      dataIndex: "tripCode",
      key: "tripCode",
    },
    {
      title: "Giá vé",
      dataIndex: "ticketPrice",
      key: "ticketPrice",
      render: (price) => `${new Intl.NumberFormat("vi-VN").format(price)} VNĐ`,
    },
    {
      title: "Trạng thái vé",
      dataIndex: "ticketStatus",
      key: "ticketStatus",
      render: (status) =>
        TICKET_STATUS_OPTION.find((opt) => opt.value === status)?.label ||
        status,
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "ticketPaymentType",
      key: "ticketPaymentType",
      render: (status) =>
        PAYMENT_TYPE_OPTION.find((opt) => opt.value === status)?.label ||
        status,
    },
    {
      title: "Số ghế",
      dataIndex: "seatNumber",
      key: "seatNumber",
    },
    {
      title: "Điểm đi",
      dataIndex: "fromStation",
      key: "fromStation",
    },
    {
      title: "Điểm đến",
      dataIndex: "toStation",
      key: "toStation",
    },
    {
      title: "Người bán",
      dataIndex: "ticketSoldBy",
      key: "ticketSoldBy",
    },
  ];

  return (
    <>
      <Card>
        <h2>Search area</h2>
        <Form form={formInstance}>
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <Form.Item name="ticketCode">
                <Input placeholder="Mã vé" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="tripCode">
                <Input placeholder="Mã chuyến" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="ticketPaymentType">
                <Select
                  placeholder="Hình thức thanh toán"
                  options={PAYMENT_TYPE_OPTION}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="ticketSoldBy">
                <Input placeholder="Người bán" />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={8}>
            <Col>
              <Button
                htmlType="reset"
                onClick={() => formInstance.resetFields()}
              >
                Reset
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: VietBusTheme.primary,
                  color: VietBusTheme.white,
                }}
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Table
        className="pt-4"
        dataSource={listPendingTicket}
        columns={columns}
      />
    </>
  );
};

export default PendingTicket;
