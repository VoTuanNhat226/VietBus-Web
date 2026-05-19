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
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllRoute } from "../../services/RouteService";
import moment from "moment";
import { VietBusTheme } from "../../constants/VietBusTheme";
import { ACTIVE_OPTIONS } from "../../constants/Constants.js";
import { getAllStation } from "../../services/StationService";
import AddRouteModal from "./Modal/AddRouteModal";
import UpdateRouteModal from "./Modal/UpdateRouteModal";
import { formatDateTime } from "../../utils/Utils.js";
import { EditOutlined } from "@ant-design/icons";

const RouteManagement = () => {
  const { user } = useAuth();
  const [formInstance] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [listRoute, setListRoute] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [listStation, setListStation] = useState([]);

  const fetchRoutes = async (payload = {}) => {
    try {
      setIsLoading(true);
      const res = await getAllRoute(payload);
      setListRoute(res?.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setIsLoading(true);
        const res = await getAllStation({});
        setListStation(res?.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStation();
    fetchRoutes();
  }, []);

  const handleSearch = () => {
    const payload = formInstance.getFieldsValue();
    fetchRoutes(payload);
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
        title: "Điểm đi",
        dataIndex: "fromStation",
        key: "fromStation",
        align: "center",
        render: (value) => <span>{value?.name}</span>,
      },
      {
        title: "Điểm đến",
        dataIndex: "toStation",
        key: "toStation",
        align: "center",
        render: (value) => <span>{value?.name}</span>,
      },
      {
        title: "Khoảng cách",
        dataIndex: "distanceKm",
        key: "distanceKm",
        align: "center",
        render: (value) => <span>{value} km</span>,
      },
      {
        title: "Trạng thái",
        dataIndex: "active",
        key: "active",
        align: "center",
        render: (value) => (
          <span
            style={{
              color:
                value === false ? VietBusTheme.error : VietBusTheme.success,
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
        align: "center",
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "center",
        render: (value) => (value ? formatDateTime(value) : ""),
      },
      {
        title: "Người cập nhật",
        dataIndex: "updatedBy",
        key: "updatedBy",
        align: "center",
      },
      {
        title: "Ngày cập nhật",
        dataIndex: "updatedAt",
        key: "updatedAt",
        align: "center",
        render: (value) => (value ? formatDateTime(value) : ""),
      },
      {
        title: "Thao tác",
        key: "action",
        align: "center",
        render: (_, record) => (
          <div className="flex justify-evenly">
            <EditOutlined
              style={{
                color: VietBusTheme.primary,
                fontSize: 18,
                cursor: "pointer",
              }}
              title="Cập nhật"
              onClick={() => {
                setSelectedRoute(record);
                setOpenUpdateModal(true);
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const stationOptions = useMemo(
    () =>
      listStation.map((station) => ({
        label: station.name,
        value: station.stationId,
      })),
    [listStation],
  );

  return (
    <div>
      <Card>
        <h2>Search area</h2>
        <Form form={formInstance}>
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <Form.Item name="fromStationId">
                <Select
                  showSearch
                  placeholder="Điểm đi"
                  options={stationOptions}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="toStationId">
                <Select
                  showSearch
                  placeholder="Điểm đến"
                  options={stationOptions}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="distanceKm"
                rules={[{ pattern: /^[0-9]+$/, message: "Chỉ được nhập số" }]}
              >
                <Input placeholder="Khoảng cách" />
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
                Search
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
      <Table
        className="pt-4"
        loading={isLoading}
        rowKey="routeId"
        dataSource={listRoute}
        columns={columns}
      />
      {/* ADD Route Modal */}
      <AddRouteModal
        open={openAddModal}
        listStation={listStation}
        onClose={() => setOpenAddModal(false)}
        onSuccess={fetchRoutes}
      />
      {/* UPDATE Route Modal */}
      <UpdateRouteModal
        open={openUpdateModal}
        route={selectedRoute}
        onClose={() => {
          setOpenUpdateModal(false);
          setSelectedRoute(null);
        }}
        onSuccess={fetchRoutes}
      />
    </div>
  );
};

export default RouteManagement;
