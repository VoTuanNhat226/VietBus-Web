import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVehicleIById } from "../../services/VehicleService";
import { getSeatByVehicleId } from "../../services/SeatService";
import SeatMap from "./Seat/SeatMap";
import { Card, Col, Row } from "antd";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { VietBusTheme } from "../../constants/VietBusTheme.js";

const VehicleDetail = () => {
  const { vehicleId } = useParams();

  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("CHI TIẾT XE");
  }, []);

  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const vehicle = await getVehicleIById({ vehicleId: vehicleId });
      setVehicle(vehicle?.data);
    };
    fetchData();
  }, []);

  return (
    <div className="flex justify-evenly">
      <Card
        className=" w-3/12
          rounded-xl
          hover:shadow-xl"
      >
        <div>
          <SeatMap title={"SƠ ĐỒ GHẾ"}/>
        </div>
      </Card>
      <Card
        className=" w-8/12
          rounded-xl
          hover:shadow-xl
          pl-4"
      >
        <Card
          className=" w-full
          rounded-xl
          hover:shadow-xl
          mb-2"
        >
          <div className="h-8">
            <span className="text-xl font-bold">
              <i
                class="fa-solid fa-circle-exclamation pr-4"
                style={{ color: VietBusTheme.primary }}
              />
              Thông tin kỹ thuật
            </span>
          </div>
          <hr />
          <div className="pt-4">
            <Row gutter={[16, 0]} className="pb-4">
              <Col span={8}>
                <div
                  className="text-lg font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  Biển số xe
                </div>
                <div className="text-xl font-bold">{vehicle?.licensePlate}</div>
              </Col>
              <Col span={8}>
                <div
                  className="text-lg font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  Dòng xe (Model)
                </div>
                <div className="text-xl font-bold">{vehicle?.model}</div>
              </Col>
              <Col span={8}>
                <div
                  className="text-lg font-bold"
                  style={{ color: VietBusTheme.primary }}
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
                  style={{ color: VietBusTheme.primary }}
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
                  style={{ color: VietBusTheme.primary }}
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
                  style={{ color: VietBusTheme.primary }}
                >
                  Số km đã đi
                </div>
                <div className="text-xl font-bold">{vehicle?.totalKm} km</div>
              </Col>
            </Row>
          </div>
        </Card>
        <Card
          className=" w-full
          rounded-xl
          hover:shadow-xl"
        >
          <div className="h-8">
            <span className="text-xl font-bold">
              <i
                class="fa-solid fa-clock-rotate-left pr-4"
                style={{ color: VietBusTheme.primary }}
              />
              Lịch sử bảo trì & Nhật ký
            </span>
          </div>
          <hr />
          <div></div>
        </Card>
      </Card>
    </div>
  );
};

export default VehicleDetail;
