import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {getVehicleById} from "../../services/VehicleService";
import SeatMap40 from "./Seat/SeatMap40.jsx";
import {Card, Col, Row, Spin} from "antd";
import {usePageTitle} from "../../context/PageTitleContext.jsx";
import {VietBusTheme} from "../../constants/VietBusTheme.js";
import SeatMap34 from "./Seat/SeatMap34.jsx";

const VehicleDetail = () => {
    const {setTitle} = usePageTitle();

    const {vehicleId} = useParams();
    const [vehicle, setVehicle] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setTitle("CHI TIẾT XE");
    }, [setTitle]);

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

    const renderSeatMap = useMemo(() => {
        switch (vehicle?.totalSeat) {
            case 40:
                return <SeatMap40 title="SƠ ĐỒ GHẾ"/>;
            case 34:
                return <SeatMap34 title="SƠ ĐỒ GHẾ"/>;
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
                        <div className="h-8">
            <span className="text-xl font-bold">
              <i
                  class="fa-solid fa-clock-rotate-left pr-4"
                  style={{color: VietBusTheme.primary}}
              />
              Lịch sử bảo trì & Nhật ký
            </span>
                        </div>
                        <hr/>
                        <div></div>
                    </Card>
                </div>
            </div>
        </Spin>
    );
};

export default VehicleDetail;
