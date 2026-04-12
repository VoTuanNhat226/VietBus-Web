import {useEffect, useState} from "react";
import {usePageTitle} from "../../context/PageTitleContext.jsx";
import {useAuth} from "../../context/AuthContext";
import {Button, Card, Col, Form, Input, Row, Select, Spin, Table} from "antd";
import moment from "moment";
import {VietBusTheme} from "../../constants/VietBusTheme.js";
import AddTripModal from "./Modal/AddTripModal.jsx";
import {getAllTrip} from "../../services/TripService.js";
import {getAllStation} from "../../services/StationService.js";
import {getAllEmployee} from "../../services/EmployeeService.js";
import {getAllVehicle} from "../../services/VehicleService.js";
import {STATUS_TRIP_OPTIONS} from "../../constants/Constants.js";
import {useNavigate} from "react-router-dom";

const TripManagement = () => {
    const [formInstance] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const [listTrip, setListTrip] = useState([]);
    const [listStation, setListStation] = useState([]);
    const [listDriver, setListDriver] = useState([]);
    const [listVehicle, setListVehicle] = useState([]);

    const {user} = useAuth();
    const {setTitle} = usePageTitle();
    const navigate = useNavigate();

    useEffect(() => {
        setTitle("QUẢN LÝ CHUYẾN XE");
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [tripRes, stationRes, employeeRes, vehicleRes] =
                    await Promise.all([
                        getAllTrip({}),
                        getAllStation({}),
                        getAllEmployee({}),
                        getAllVehicle({})
                    ]);

                setListTrip(tripRes?.data);
                setListStation(stationRes?.data);

                setListDriver(
                    employeeRes?.data?.filter(
                        (item) => item.position === "DRIVER"
                    )
                );

                setListVehicle(vehicleRes?.data);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = async () => {
        setIsLoading(true);
        const payload = {
            fromStationId: formInstance.getFieldValue("fromStationId"),
            toStationId: formInstance.getFieldValue("toStationId"),
            driverId: formInstance.getFieldValue("driverId"),
            vehicleId: formInstance.getFieldValue("vehicleId"),
            status: formInstance.getFieldValue("status"),
            tripCode: formInstance.getFieldValue("tripCode"),
        };
        const res = await getAllTrip(payload);
        setListTrip(res?.data);
        setIsLoading(false);
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
            title: "Mã chuyến",
            dataIndex: "tripCode",
            key: "tripCode",
        },
        {
            title: "Điểm đi",
            key: "fromStation",
            render: (value) => <span>{value?.fromStation}</span>,
        },
        {
            title: "Điểm đến",
            key: "toStation",
            render: (value) => <span>{value?.toStation}</span>,
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
            title: "Xe (biển số xe)",
            key: "bus",
            render: (value) => <span>{value?.licensePlate}</span>,
        },
        {
            title: "Tài xế",
            key: "driver",
            render: (value) => (
                <div>
                    {value?.driverNames?.map((driver, index) => (
                        <div key={index}>{driver}</div>
                    ))}
                </div>
            ),
        },
        {
            title: "Phụ xe",
            key: "assistant",
            render: (value) => (
                <div>
                    {value?.assistantNames?.map((assistant, index) => (
                        <div key={index}>{assistant}</div>
                    ))}
                </div>
            ),
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
                        onClick={() => navigate(`/trip/${record.tripId}`)}
                    />
                </div>
            ),
        },
    ];
    return (
        <>
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
                                        label: driver.fullName,
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
                        <Col span={6}>
                            <Form.Item name="tripCode">
                                <Input placeholder="Nhập mã chuyến"></Input>
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
            <Table className="pt-4" loading={isLoading} dataSource={listTrip} columns={columns}/>
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
        </>
    );
};

export default TripManagement;
