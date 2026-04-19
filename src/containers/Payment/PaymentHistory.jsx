import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Select, Table } from "antd";
import { getAllPayment } from "../../services/PaymentService.js";
import {
  PAYMENT_METHOD_OPTION,
  PAYMENT_STATUS_OPTION,
  PAYMENT_TYPE_OPTION,
  TICKET_STATUS_OPTION,
} from "../../constants/Constants.js";
import { VietBusTheme } from "../../constants/VietBusTheme.js";
import { formatDateTime } from "../../utils/Utils.js";

const PaymentHistory = () => {
  const [formInstance] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [listPayment, setListPayment] = useState([]);

  useEffect(() => {
    const fetchAllPayment = async () => {
      setIsLoading(true);
      const res = await getAllPayment({});
      setListPayment(res?.data);
      setIsLoading(false);
    };
    fetchAllPayment();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const payload = {
        method: formInstance.getFieldValue("method"),
        ticketCode: formInstance.getFieldValue("ticketCode"),
        ticketPaymentType: formInstance.getFieldValue("ticketPaymentType"),
      };
      const res = await getAllPayment(payload);
      setListPayment(res?.data || []);
    } catch (e) {
      console.error(e);
      setListPayment([]);
    } finally {
      setIsLoading(false);
    }
  };

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
        title: "Giá vé",
        dataIndex: "ticketPrice",
        key: "ticketPrice",
        align: "center",
        render: (price) =>
          `${new Intl.NumberFormat("vi-VN").format(price)} VNĐ`,
      },
      {
        title: "Hình thức thanh toán",
        dataIndex: "ticketPaymentType",
        key: "ticketPaymentType",
        align: "center",
        render: (status) =>
          PAYMENT_TYPE_OPTION.find((opt) => opt.value === status)?.label ||
          status,
      },
      {
        title: "Phương thức thanh toán",
        dataIndex: "method",
        key: "method",
        align: "center",
        render: (status) =>
          PAYMENT_METHOD_OPTION.find((opt) => opt.value === status)?.label ||
          status,
      },
      {
        title: "Tiền đã thanh toán",
        dataIndex: "amount",
        key: "amount",
        align: "center",
        render: (price) =>
          `${new Intl.NumberFormat("vi-VN").format(price)} VNĐ`,
      },
      {
        title: "Ngày thanh toán",
        dataIndex: "paidAt",
        key: "paidAt",
        align: "center",
        render: (value) => (value ? formatDateTime(value) : ""),
      },
    ],
    [],
  );

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
          </Row>
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={() => formInstance.resetFields()}>Reset</Button>
            </Col>
            <Col>
              <Button
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
        loading={isLoading}
        dataSource={listPayment}
        columns={columns}
      />
    </>
  );
};

export default PaymentHistory;
