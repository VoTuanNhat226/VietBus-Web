import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {getVehicleById} from "../../services/VehicleService";
import {getVehicleMaintenanceByVehicleId} from "../../services/VehicleMaintenanceService";
import SeatMap40 from "./Seat/SeatMap40.jsx";
import {Button, Card, Col, Row, Spin, Table, Tag} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {usePageTitle} from "../../context/PageTitleContext.jsx";
import {VietBusTheme} from "../../constants/VietBusTheme.js";
import SeatMap34 from "./Seat/SeatMap34.jsx";
import SeatMap24 from "./Seat/SeatMap24.jsx";
import VehicleMaintenanceModal from "./Modal/VehicleMaintenanceModal.jsx";
import {
    MAINTENANCE_STATUS_OPTIONS,
    MAINTENANCE_TYPE_OPTIONS,
} from "../../constants/Constants.js";
import {formatDate, formatVND} from "../../utils/Utils.js";

const VehicleDetail = () => {
    const {setTitle} = usePageTitle();

    const {vehicleId} = useParams();
    const [vehicle, setVehicle] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [maintenanceList, setMaintenanceList] = useState([]);
    const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(false);
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await getVehicleById({vehicleId});
                setVehicle(res?.data);
            } catch (error) {
                console.error("Fetch vehicle failed:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [vehicleId]);

    const fetchMaintenanceHistory = async () => {
        try {
            setIsMaintenanceLoading(true);
            const res = await getVehicleMaintenanceByVehicleId({vehicleId});
            setMaintenanceList(res?.data || []);
        } catch (error) {
            console.error("Fetch vehicle maintenance history failed:", error);
        } finally {
            setIsMaintenanceLoading(false);
        }
    };

    useEffect(() => {
        if (vehicleId) {
            fetchMaintenanceHistory();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleId]);

    const handleOpenCreateMaintenance = () => {
        setSelectedMaintenance(null);
        setIsMaintenanceModalOpen(true);
    };

    const handleOpenUpdateMaintenance = (record) => {
        setSelectedMaintenance(record);
        setIsMaintenanceModalOpen(true);
    };

    const handleCloseMaintenanceModal = () => {
        setSelectedMaintenance(null);
        setIsMaintenanceModalOpen(false);
    };

    const maintenanceStatusColor = {
        SCHEDULED: "blue",
        IN_PROGRESS: "gold",
        COMPLETED: "green",
        CANCELLED: "red",
    };

    const maintenanceColumns = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: "Ngày thực hiện",
            dataIndex: "maintenanceDate",
            key: "maintenanceDate",
            width: 130,
            align: "center",
            render: (text) => formatDate(text),
        },
        {
            title: "Loại",
            dataIndex: "maintenanceType",
            key: "maintenanceType",
            align: "center",
            render: (value) =>
                MAINTENANCE_TYPE_OPTIONS.find((opt) => opt.value === value)?.label || value,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (value) => (
                <Tag color={maintenanceStatusColor[value] || "default"}>
                    {MAINTENANCE_STATUS_OPTIONS.find((opt) => opt.value === value)?.label || value}
                </Tag>
            ),
        },
        {
            title: "Số km",
            dataIndex: "odometerKm",
            key: "odometerKm",
            align: "center",
            render: (value) => (value != null ? `${value} km` : "-"),
        },
        {
            title: "Chi phí",
            dataIndex: "cost",
            key: "cost",
            align: "center",
            render: (value) => (value != null ? formatVND(value) : "-"),
        },
        {
            title: "Ga-ra",
            dataIndex: "garageName",
            key: "garageName",
            align: "center",
            render: (value) => value || "-",
        },
        {
            title: "Bảo trì tiếp theo",
            dataIndex: "nextMaintenanceDate",
            key: "nextMaintenanceDate",
            align: "center",
            render: (text) => (text ? formatDate(text) : "-"),
        },
    ];

    const renderSeatMap = useMemo(() => {
        switch (vehicle?.totalSeat) {
            case 40:
                return <SeatMap40 title="SƠ ĐỒ GHẾ"/>;
            case 34:
                return <SeatMap34 title="SƠ ĐỒ GHẾ"/>;
            case 24:
                return <SeatMap24 title="SƠ ĐỒ GHẾ"/>
            default:
                return null;
        }
    }, [vehicle?.totalSeat]);

    return (
        <Spin spinning={isLoading}>
            <div className="flex justify-evenly">
                <Card className="w-3/12 mr-5  rounded-xl hover:shadow-xl">
                    <div>
                        {renderSeatMap}
                    </div>
                </Card>
                <div className="w-9/12">
                    <Card className="rounded-xl hover:shadow-xl mb-5">
                        <div className="h-8">
            <span className="text-xl font-bold">
              <i
                  class="fa-solid fa-circle-exclamation pr-4"
                  style={{color: VietBusTheme.primary}}
              />
              Thông tin kỹ thuật
            </span>
                        </div>
                        <hr/>
                        <div className="pt-4">
                            <Row gutter={[16, 0]} className="pb-4">
                                <Col span={8}>
                                    <div
                                        className="text-lg font-bold"
                                        style={{color: VietBusTheme.primary}}
                                    >
                                        Biển số xe
                                    </div>
                                    <div className="text-xl font-bold">{vehicle?.licensePlate}</div>
                                </Col>
                                <Col span={8}>
                                    <div
                                        className="text-lg font-bold"
                                        style={{color: VietBusTheme.primary}}
                                    >
                                        Dòng xe (Model)
                                    </div>
                                    <div className="text-xl font-bold">{vehicle?.model}</div>
                                </Col>
                                <Col span={8}>
                                    <div
                                        className="text-lg font-bold"
                                        style={{color: VietBusTheme.primary}}
                                    >
                                        Năm sản xuất
                                    </div>
                                    <div className="text-xl font-bold">
                                        {vehicle?.manufactureYear}
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={[16, 0]}>
                                <Col span={8}>
                                    <div
                                        className="text-lg font-bold"
                                        style={{color: VietBusTheme.primary}}
                                    >
                                        Tải trọng/Sức chứa
                                    </div>
                                    <div className="text-xl font-bold">
                                        {vehicle?.totalSeat} giường nằm
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div
                                        className="text-lg font-bold"
                                        style={{color: VietBusTheme.primary}}
                                    >
                                        Tình trạng
                                    </div>
                                    <div
                                        className="text-xl font-bold"
                                        style={{
                                            color: vehicle?.active
                                                ? VietBusTheme.success
                                                : VietBusTheme.error,
                                        }}
                                    >
                                        {vehicle?.active ? "Hoạt động" : "Không hoạt động"}
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div
                                        className="text-lg font-bold"
                                        style={{color: VietBusTheme.primary}}
                                    >
                                        Số km đã đi
                                    </div>
                                    <div className="text-xl font-bold">{vehicle?.totalKm} km</div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    <Card className="rounded-xl hover:shadow-xl mb-5">
                        <div className="h-8 flex items-center justify-between">
            <span className="text-xl font-bold">
              <i
                  class="fa-solid fa-clock-rotate-left pr-4"
                  style={{color: VietBusTheme.primary}}
              />
              Lịch sử bảo trì & Nhật ký
            </span>
                            <Button
                                type="primary"
                                icon={<PlusOutlined/>}
                                className="rounded-lg font-semibold"
                                style={{
                                    backgroundColor: VietBusTheme.primary,
                                    borderColor: VietBusTheme.primary,
                                    color: VietBusTheme.white,
                                }}
                                onClick={handleOpenCreateMaintenance}
                            >
                                Thêm lịch sử
                            </Button>
                        </div>
                        <hr/>
                        <div className="pt-4">
                            <Table
                                loading={isMaintenanceLoading}
                                dataSource={maintenanceList}
                                columns={maintenanceColumns}
                                rowKey="id"
                                pagination={{pageSize: 5}}
                                onRow={(record) => ({
                                    onClick: () => handleOpenUpdateMaintenance(record),
                                    className: "cursor-pointer",
                                })}
                            />
                        </div>
                    </Card>
                </div>
            </div>

            <VehicleMaintenanceModal
                open={isMaintenanceModalOpen}
                onClose={handleCloseMaintenanceModal}
                onSuccess={fetchMaintenanceHistory}
                vehicleId={vehicleId}
                record={selectedMaintenance}
            />
        </Spin>
    );
};

export default VehicleDetail;
