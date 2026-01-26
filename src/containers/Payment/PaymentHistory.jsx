import { useEffect, useState } from "react";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { Button, Card, Col, Form, Input, Row, Select, Table } from "antd";
import { useAuth } from "../../context/AuthContext.jsx";
import { getAllPayment } from "../../services/PaymentService.js";
import {
  PAYMENT_METHOD_OPTION,
  PAYMENT_STATUS_OPTION,
  PAYMENT_TYPE_OPTION,
  TICKET_STATUS_OPTION,
} from "../../constants/Constants.js";
import moment from "moment";
import { VietBusTheme } from "../../constants/VietBusTheme.js";

const PaymentHistory = () => {
  const [formInstance] = Form.useForm();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [listPayment, setListPayment] = useState([]);

  const { user } = useAuth();

  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("LỊCH SỬ THANH TOÁN");
  }, []);

  useEffect(() => {
    const fetchAllPayment = async () => {
      const res = await getAllPayment({});
      setListPayment(res?.data);
    };
    fetchAllPayment();
  }, []);

  const handleSearch = async () => {
    const payload = {
      method: formInstance.getFieldValue("method"),
      status: formInstance.getFieldValue("status"),
      ticketCode: formInstance.getFieldValue("ticketCode"),
      ticketStatus: formInstance.getFieldValue("ticketStatus"),
      ticketPaymentType: formInstance.getFieldValue("ticketPaymentType"),
    };
    const res = await getAllPayment(payload);
    setListPayment(res?.data);
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
      title: "Phương thức thanh toán",
      dataIndex: "method",
      key: "method",
      render: (status) =>
        PAYMENT_METHOD_OPTION.find((opt) => opt.value === status)?.label ||
        status,
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        PAYMENT_STATUS_OPTION.find((opt) => opt.value === status)?.label ||
        status,
    },
    {
      title: "Tiền đã thanh toán",
      dataIndex: "amount",
      key: "amount",
      render: (price) => `${new Intl.NumberFormat("vi-VN").format(price)} VNĐ`,
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paidAt",
      key: "paidAt",
      render: (value) =>
        value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
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
              <Form.Item name="ticketStatus">
                <Select
                  placeholder="Trạng thái vé"
                  options={TICKET_STATUS_OPTION}
                />
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
              <Form.Item name="method">
                <Select
                  placeholder="Phương thức thanh toán"
                  options={PAYMENT_METHOD_OPTION}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status">
                <Select
                  placeholder="Trạng thái thanh toán"
                  options={PAYMENT_STATUS_OPTION}
                ></Select>
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
      <Table className="pt-4" dataSource={listPayment} columns={columns} />
    </>
  );
};

export default PaymentHistory;
