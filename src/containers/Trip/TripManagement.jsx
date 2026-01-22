import { useEffect, useState } from "react";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Col, Form, Row, Select, Table } from "antd";
import moment from "moment";
import { VietBusTheme } from "../../constants/VietBusTheme.js";
import AddTripModal from "./Modal/AddTripModal.jsx";
import { getAllTrip } from "../../services/TripService.js";
import { getAllStation } from "../../services/StationService.js";
import { getAllEmployee } from "../../services/EmployeeService.js";
import { getAllVehicle } from "../../services/VehicleService.js";
import { STATUS_TRIP_OPTIONS } from "../../constants/Contans.js";

const TripManagement = () => {
  const [formInstance] = Form.useForm();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [listTrip, setListTrip] = useState([]);
  const [listStation, setListStation] = useState([]);
  const [listDriver, setListDriver] = useState([]);
  const [listVehicle, setListVehicle] = useState([]);

  const { user } = useAuth();

  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("QUẢN LÝ CHUYẾN XE");
  }, []);

  useEffect(() => {
    const fetchAllTrip = async () => {
      const res = await getAllTrip({});
      setListTrip(res?.data);
    };
    const fetchAllStation = async () => {
      const res = await getAllStation({});
      setListStation(res?.data);
    };
    const fetchAllDriver = async () => {
      const res = await getAllEmployee({});
      const drivers = res?.data?.filter(
        (driver) => driver.position === "DRIVER"
      );
      setListDriver(drivers);
    };
    const fetchAllVehicle = async () => {
      const res = await getAllVehicle({});
      setListVehicle(res?.data);
    };
    fetchAllTrip();
    fetchAllStation();
    fetchAllDriver();
    fetchAllVehicle();
  }, []);

  const handleSearch = async () => {
    const payload = {
      fromStationId: formInstance.getFieldValue("fromStationId"),
      toStationId: formInstance.getFieldValue("toStationId"),
      driverId: formInstance.getFieldValue("driverId"),
      vehicleId: formInstance.getFieldValue("vehicleId"),
      status: formInstance.getFieldValue("status"),
    };
    const res = await getAllTrip(payload);
    setListTrip(res?.data);
  };

  const STATUS_TRIP_MAP = Object.fromEntries(
    STATUS_TRIP_OPTIONS.map((item) => [item.value, item.label])
  );

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
      key: "fromStation",
      render: (value) => <span>{value?.route?.fromStation?.name}</span>,
    },
    {
      title: "Điểm đến",
      key: "toStation",
      render: (value) => <span>{value?.route?.toStation?.name}</span>,
    },
    {
      title: "Thời gian xuất bến",
      dataIndex: "departureTime",
      key: "departureTime",
      render: (value) =>
        value ? moment(value).format("HH:mm DD-MM-YYYY") : "",
    },
    {
      title: "Thời gian đến (dự kiến)",
      dataIndex: "arrivalTime",
      key: "arrivalTime",
      render: (value) =>
        value ? moment(value).format("HH:mm DD-MM-YYYY") : "",
    },
    {
      title: "Tài xế",
      key: "driver",
      render: (value) => (
        <span>
          {value?.driver?.lastName} {value?.driver?.firstName}
        </span>
      ),
    },
    {
      title: "Xe (biển số xe)",
      key: "bus",
      render: (value) => <span>{value?.vehicle?.licensePlate}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <span>{STATUS_TRIP_MAP[status] || status}</span>,
    },
    {
      title: "Chi tiết",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-evenly">
          <i
            className="fa-solid fa-angles-right"
            style={{
              color: VietBusTheme.primary,
              fontSize: 18,
              cursor: "pointer",
            }}
            // onClick={() => navigate(`/vehicle/${record.vehicleId}`)}
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
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="fromStationId">
                <Select
                  placeholder="Chọn điểm đi"
                  options={listStation?.map((station) => ({
                    label: station.name,
                    value: station.stationId,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="toStationId">
                <Select
                  placeholder="Chọn điểm đến"
                  options={listStation?.map((station) => ({
                    label: station.name,
                    value: station.stationId,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="driverId">
                <Select
                  placeholder="Chọn tài xế"
                  options={listDriver?.map((driver) => ({
                    label: driver.lastName + " " + driver.firstName,
                    value: driver.employeeId,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="vehicleId">
                <Select
                  placeholder="Chọn xe"
                  options={listVehicle?.map((vehicle) => ({
                    label: vehicle.licensePlate,
                    value: vehicle.vehicleId,
                  }))}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status">
                <Select
                  placeholder="Chọn trạng thái"
                  options={STATUS_TRIP_OPTIONS}
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
      {user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER" ? (
        <div className="pt-4 flex justify-end">
          <Button
            type="primary"
            style={{
              backgroundColor: VietBusTheme.primary,
              color: VietBusTheme.white,
            }}
            onClick={() => setOpenAddModal(true)}
          >
            Tạo chuyến xe
          </Button>
        </div>
      ) : null}
      <Table className="pt-4" dataSource={listTrip} columns={columns} />
      {/* ADD Modal */}
      {openAddModal && (
        <AddTripModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={async () => {
            const res = await getAllTrip({});
            setListTrip(res?.data);
          }}
        />
      )}
    </div>
  );
};

export default TripManagement;
