import { useParams } from "react-router-dom";
import { usePageTitle } from "../../context/PageTitleContext";
import { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { VietBusTheme } from "../../constants/VietBusTheme";
import { getTripById } from "../../services/TripService";
import {
  countTripSeatSoldByTripId,
  getAllTripSeatByTripId,
} from "../../services/TripSeatService";
import moment from "moment";
import SeatMap from "../Vehicle/Seat/SeatMap";
import { CarOutlined } from "@ant-design/icons";
import { STATUS_TRIP_OPTIONS } from "../../constants/Constants.js";

const TripDetail = () => {
  const { tripId } = useParams();

  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("CHI TIẾT CHUYẾN XE");
  }, []);

  const [trip, setTrip] = useState(null);
  const [expectedRevenue, setExpectedRevenue] = useState(0);
  const [tripSeatSold, setTripSeatSold] = useState(0);
  const [listTripSeat, setListTripSeat] = useState([]);

  useEffect(() => {
    const fetchTrip = async () => {
      const res = await getTripById({ tripId });
      setTrip(res?.data);
      setExpectedRevenue(res?.data?.price * res?.data?.vehicle?.totalSeat);
    };

    const fetchCountTripSeatSold = async () => {
      const res = await countTripSeatSoldByTripId({ tripId: tripId });
      setTripSeatSold(res?.data || 0);
    };

    const fetchAllTripSeat = async () => {
      const res = await getAllTripSeatByTripId({ tripId: tripId });
      setListTripSeat(res?.data);
    };

    fetchTrip();
    fetchCountTripSeatSold();
    fetchAllTripSeat();
  }, [tripId]);

  const fillRate =
    trip?.vehicle?.totalSeat > 0
      ? Math.round((tripSeatSold / trip.vehicle.totalSeat) * 100)
      : 0;

  const statusLabel =
    STATUS_TRIP_OPTIONS.find((opt) => opt.value === trip?.status)?.label ||
    trip?.status;

  return (
    <>
      <div className="flex justify-evenly">
        <div className="w-3/12">
          <Card className="rounded-xl">
            <SeatMap listTripSeat={listTripSeat} title={"TÌNH TRẠNG VÉ"} />
          </Card>
          <Card className="rounded-xl">
            <div className="flex justify-between">
              <div className="flex flex-col justify-center items-center">
                <CarOutlined className="text-2xl text-gray-400" />
                <div>Trống</div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <CarOutlined className="text-2xl text-red-500" />
                <div>Đang giữ</div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <CarOutlined className="text-2xl text-green-600" />
                <div>Đã đặt</div>
              </div>
            </div>
          </Card>
        </div>
        <div className="w-9/12">
          <Card className="">
            <div className="flex justify-between">
              <div className="flex">
                <div>
                  <i
                    class="fa-solid fa-hashtag pr-4 text-5xl font-bold"
                    style={{ color: VietBusTheme.primary }}
                  />
                </div>
                <div>
                  <div className="text-sm font-bold">Mã chuyến xe</div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: VietBusTheme.primary }}
                  >
                    {trip?.tripCode}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold">Trạng thái</div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {statusLabel}
                </div>
              </div>
              <div>
                <div className="text-sm font-bold">Giá vé</div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {trip?.price?.toLocaleString("vi-VN")} VND
                </div>
              </div>
              <div>
                <div className="text-sm font-bold">Doanh thu dự kiến</div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {expectedRevenue?.toLocaleString("vi-VN")} VND
                </div>
              </div>
              <div>
                <div className="text-sm font-bold">Vé đã bán</div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {tripSeatSold}/{trip?.vehicle?.totalSeat}
                  <span>({fillRate}%)</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-0">
            <div className="flex">
              <div className="w-full h-full">
                <div className="flex justify-between h-full items-center">
                  <div>
                    <div className="text-sm font-bold">
                      <i className="fa-solid fa-location-dot pr-2" />
                      Khởi hành
                    </div>
                    <div
                      className="text-xl font-bold"
                      style={{ color: VietBusTheme.primary }}
                    >
                      {trip?.route?.fromStation?.name}
                    </div>
                    <div className="font-bold">
                      {trip?.departureTime &&
                        moment(trip.departureTime).format("HH:mm DD-MM-YYYY")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold">
                      <i className="fa-solid fa-utensils pr-2" />
                      Trạm dừng chân
                    </div>
                    <div
                      className="text-xl font-bold"
                      style={{ color: VietBusTheme.primary }}
                    >
                      {trip?.restStop ?? "—"}
                    </div>
                    <div className="font-bold">
                      {trip?.restTime &&
                        moment(trip.restTime).format("HH:mm DD-MM-YYYY")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold">
                      <i className="fa-solid fa-flag pr-2" />
                      Điểm kết thúc
                    </div>
                    <div
                      className="text-xl font-bold"
                      style={{ color: VietBusTheme.primary }}
                    >
                      {trip?.route?.toStation?.name}
                    </div>
                    <div className="font-bold">
                      {trip?.arrivalTime &&
                        moment(trip.arrivalTime).format("HH:mm DD-MM-YYYY")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold">Tài xế chính</div>
                    <div
                      className="text-xl font-bold"
                      style={{ color: VietBusTheme.primary }}
                    >
                      {trip?.driver?.lastName} {trip?.driver?.firstName}
                    </div>
                    <div className="font-bold">
                      <i class="fa-solid fa-phone mr-2" />
                      {trip?.driver?.phoneNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold">Thông tin xe</div>
                    <div
                      className="text-xl font-bold"
                      style={{ color: VietBusTheme.primary }}
                    >
                      Biển số xe: {trip?.vehicle?.licensePlate}
                    </div>
                    <div className="font-bold">
                      {trip?.vehicle?.totalSeat} giường
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {/* <div className="flex mb-4">

       
        </div> */}
    </>
  );
};

export default TripDetail;
