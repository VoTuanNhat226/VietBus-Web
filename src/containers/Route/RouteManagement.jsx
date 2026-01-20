import { Button, Card, Col, Form, Input, Row, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePageTitle } from "../../context/PageTitleContext";
import { getAllRoute } from "../../services/RouteService";
import moment from "moment";
import { VietBusTheme } from "../../constants/VietBusTheme";
import { ACTIVE_OPTIONS } from "../../constants/Contans";

const RouteManagement = () => {
  const [formInstance] = Form.useForm();

  const [listRoute, setListRoute] = useState([]);

  const { user } = useAuth();

  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("QUẢN LÝ TUYẾN XE");
  }, []);

  useEffect(() => {
    const fetchAllRoute = async () => {
      const res = await getAllRoute({});
      setListRoute(res?.data);
    };
    fetchAllRoute();
  }, []);

  const handleSearch = async () => {
    const payload = {
      fromStation: formInstance.getFieldValue("fromStation"),
      toStation: formInstance.getFieldValue("toStation"),
      distanceKm: formInstance.getFieldValue("distanceKm"),
      durationMinutes: formInstance.getFieldValue("durationMinutes"),
      active: formInstance.getFieldValue("active"),
      createdBy: formInstance.getFieldValue("createdBy"),
      updatedBy: formInstance.getFieldValue("updatedBy"),
    };
    const res = await getAllRoute(payload);
    setListRoute(res?.data);
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
      title: "Khoảng cách",
      dataIndex: "distanceKm",
      key: "distanceKm",
      render: (value) => <span>{value} km</span>,
    },
    {
      title: "Thời gian",
      dataIndex: "durationMinutes",
      key: "durationMinutes",
      render: (value) => <span>{value} phút</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (value) => (
        <span
          style={{
            color: value === false ? VietBusTheme.error : VietBusTheme.success,
          }}
        >
          {value === true ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
    },
    {
      title: "Người cập nhật",
      dataIndex: "updatedBy",
      key: "updatedBy",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) =>
        value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
    },
    {
      title: "Chỉnh sửa",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-evenly">
          <i
            className="fa-regular fa-pen-to-square"
            style={{
              color: VietBusTheme.primary,
              fontSize: 18,
              cursor: "pointer",
            }}
            // onClick={() => {
            //   setSelectedAccount(record);
            //   setOpenUpdateModal(true);
            // }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <h2>Search area</h2>
        <Form form={formInstance}>
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <Form.Item name="fromStation">
                <Input placeholder="Điểm đi" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="toStation">
                <Input placeholder="Điểm đến" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="distanceKm">
                <Input placeholder="Khoảng cách" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="durationMinutes">
                <Input placeholder="Thời gian" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="active">
                <Select
                  placeholder="Trạng thái"
                  options={ACTIVE_OPTIONS}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="createdBy">
                <Input placeholder="Người tạo" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="updatedBy">
                <Input placeholder="Người cập nhật" />
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
      <Table className="pt-4" dataSource={listRoute} columns={columns} />
    </div>
  );
};

export default RouteManagement;
