import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePageTitle } from "../../context/PageTitleContext";
import { getAllRoute } from "../../services/RouteService";
import moment from "moment";
import { VietBusTheme } from "../../constants/VietBusTheme";
import { ACTIVE_OPTIONS } from "../../constants/Contans";
import { getAllStation } from "../../services/StationService";
import AddRouteModal from "./Modal/AddRouteModal";
import UpdateRouteModal from "./Modal/UpdateRouteModal";

const RouteManagement = () => {
  const [formInstance] = Form.useForm();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [listRoute, setListRoute] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [listStation, setListStation] = useState([]);

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

  useEffect(() => {
    const fetchAllStation = async () => {
      const res = await getAllStation({});
      setListStation(res?.data);
    };
    fetchAllStation();
  }, []);

  const handleSearch = async () => {
    const payload = {
      fromStationId: formInstance.getFieldValue("fromStationId"),
      toStationId: formInstance.getFieldValue("toStationId"),
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
      render: (value) => <span>{value?.name}</span>,
    },
    {
      title: "Điểm đến",
      dataIndex: "toStation",
      key: "toStation",
      render: (value) => <span>{value?.name}</span>,
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
            onClick={() => {
              setSelectedRoute(record);
              setOpenUpdateModal(true);
            }}
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
              <Form.Item name="fromStationId">
                <Select
                  placeholder="Điểm đi"
                  options={listStation.map((station) => ({
                    label: station.name,
                    value: station.stationId,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="toStationId">
                <Select
                  placeholder="Điểm đến"
                  options={listStation.map((station) => ({
                    label: station.name,
                    value: station.stationId,
                  }))}
                ></Select>
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
      {user?.role === "ROLE_ADMIN" ? (
        <div className="pt-4 flex justify-end">
          <Button
            type="primary"
            style={{
              backgroundColor: VietBusTheme.primary,
              color: VietBusTheme.white,
            }}
            onClick={() => setOpenAddModal(true)}
          >
            Tạo tuyến xe
          </Button>
        </div>
      ) : null}
      <Table className="pt-4" dataSource={listRoute} columns={columns} />
      {/* ADD Modal */}
      <AddRouteModal
        open={openAddModal}
        listStation={listStation}
        onClose={() => setOpenAddModal(false)}
        onSuccess={async () => {
          const res = await getAllRoute({});
          setListRoute(res?.data);
        }}
      />
      {/* UPDATE Modal */}
      <UpdateRouteModal
        open={openUpdateModal}
        route={selectedRoute}
        onClose={() => {
          setOpenUpdateModal(false);
          setSelectedRoute(null);
        }}
        onSuccess={async () => {
          const res = await getAllRoute({});
          setListRoute(res?.data);
        }}
      />
    </div>
  );
};

export default RouteManagement;
