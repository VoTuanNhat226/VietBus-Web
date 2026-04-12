import {useParams} from "react-router-dom";
import {usePageTitle} from "../../context/PageTitleContext";
import {useEffect, useMemo, useState} from "react";
import {Button, Card, Divider, Spin} from "antd";
import {VietBusTheme} from "../../constants/VietBusTheme";
import {getTripById} from "../../services/TripService";
import {
    countTripSeatSoldByTripId,
    getAllTripSeatByTripId,
} from "../../services/TripSeatService";
import moment from "moment";
import SeatMap40 from "../Vehicle/Seat/SeatMap40.jsx";
import {CarOutlined} from "@ant-design/icons";
import {STATUS_TRIP_OPTIONS} from "../../constants/Constants.js";
import UpdateTripModal from "./Modal/UpdateTripModal.jsx";
import SeatMap34 from "../Vehicle/Seat/SeatMap34.jsx";
import AddTicketModal from "../Ticket/Modal/AddTicketModal.jsx";

const TripDetail = () => {
    const {tripId} = useParams();
    const {setTitle} = usePageTitle();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setTitle("CHI TIẾT CHUYẾN XE");
    }, []);

    const [trip, setTrip] = useState(null);
    const [expectedRevenue, setExpectedRevenue] = useState(0);
    const [tripSeatSold, setTripSeatSold] = useState(0);
    const [listTripSeat, setListTripSeat] = useState([]);
    const [openAddTicketModal, setOpenAddTicketModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        const [tripRes, soldRes, seatRes] = await Promise.all([
            getTripById({tripId}),
            countTripSeatSoldByTripId({tripId}),
            getAllTripSeatByTripId({tripId})
        ]);

        const tripData = tripRes?.data;

        setTrip(tripData);
        setTripSeatSold(soldRes?.data || 0);
        setListTripSeat(seatRes?.data || []);

        const price = tripData?.price || 0;
        const totalSeat = tripData.totalSeat || 0;
        setExpectedRevenue(price * totalSeat);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [tripId]);

    const fillRate =
        trip?.totalSeat > 0
            ? Math.round((tripSeatSold / trip.totalSeat) * 100)
            : 0;

    const statusLabel =
        STATUS_TRIP_OPTIONS.find((opt) => opt.value === trip?.status)?.label ||
        trip?.status;

    const renderSeatMap = useMemo(() => {
        switch (trip?.totalSeat) {
            case 40:
                return <SeatMap40 listTripSeat={listTripSeat} title="TÌNH TRẠNG VÉ"/>;
            case 34:
                return <SeatMap34 listTripSeat={listTripSeat} title="TÌNH TRẠNG VÉ"/>;
            default:
                return null;
        }
    }, [trip?.totalSeat, listTripSeat]);

    return (
        <Spin spinning={isLoading}>
            <div className="flex justify-evenly">
                <div className="w-3/12 mr-5">
                    <Card className="rounded-xl hover:shadow-xl">
                        {renderSeatMap}
                    </Card>
                    <Card className="rounded-xl hover:shadow-xl">
                        <div className="flex justify-between">
                            <div className="flex flex-col justify-center items-center">
                                <CarOutlined className="text-2xl text-gray-400"/>
                                <div>Trống</div>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <CarOutlined className="text-2xl text-red-500"/>
                                <div>Đang giữ</div>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <CarOutlined className="text-2xl text-green-600"/>
                                <div>Đã đặt</div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="w-9/12">
                    <Card className="rounded-xl hover:shadow-xl mb-5">
                        <div className="flex justify-between">
                            <div className="text-xl font-bold">THÔNG TIN</div>
                            <div>
                                <Button
                                    type="primary"
                                    style={{
                                        backgroundColor: VietBusTheme.primary,
                                        color: VietBusTheme.white,
                                    }}
                                    onClick={() => setOpenUpdateModal(true)}
                                >
                                    Cập nhật
                                </Button>
                            </div>
                        </div>
                        <Divider className="my-2"/>
                        <div className="flex justify-between">
                            <div className="flex">
                                <div>
                                    <i
                                        class="fa-solid fa-hashtag pr-4 text-5xl font-bold"
                                        style={{color: VietBusTheme.primary}}
                                    />
                                </div>
                                <div>
                                    <div className="text-sm font-bold">Mã chuyến xe</div>
                                    <div
                                        className="text-2xl font-bold"
                                        style={{color: VietBusTheme.primary}}
                                    >
                                        {trip?.tripCode}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-bold">Trạng thái</div>
                                <div
                                    className="text-2xl font-bold"
                                    style={{color: VietBusTheme.primary}}
                                >
                                    {statusLabel}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-bold">Giá vé</div>
                                <div
                                    className="text-2xl font-bold"
                                    style={{color: VietBusTheme.primary}}
                                >
                                    {trip?.price?.toLocaleString("vi-VN")} VND
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-bold">Doanh thu dự kiến</div>
                                <div
                                    className="text-2xl font-bold"
                                    style={{color: VietBusTheme.primary}}
                                >
                                    {expectedRevenue?.toLocaleString("vi-VN")} VND
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-bold">Vé đã bán</div>
                                <div
                                    className="text-2xl font-bold"
                                    style={{color: VietBusTheme.primary}}
                                >
                                    {tripSeatSold}/{trip?.totalSeat}
                                    <span>({fillRate}%)</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="rounded-xl hover:shadow-xl mb-5">
                        <div className="flex">
                            <div className="w-full h-full">
                                <div className="flex justify-between h-full items-center">
                                    <div>
                                        <div className="text-sm font-bold">
                                            <i className="fa-solid fa-location-dot pr-2"/>
                                            Khởi hành
                                        </div>
                                        <div
                                            className="text-xl font-bold"
                                            style={{color: VietBusTheme.primary}}
                                        >
                                            {trip?.fromStation}
                                        </div>
                                        <div className="font-bold">
                                            {trip?.departureTime &&
                                                moment(trip.departureTime).format("HH:mm DD-MM-YYYY")}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">
                                            <i className="fa-solid fa-flag pr-2"/>
                                            Điểm kết thúc
                                        </div>
                                        <div
                                            className="text-xl font-bold"
                                            style={{color: VietBusTheme.primary}}
                                        >
                                            {trip?.toStation}
                                        </div>
                                        <div className="font-bold">
                                            {trip?.arrivalTime &&
                                                moment(trip.arrivalTime).format("HH:mm DD-MM-YYYY")}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">Thông tin xe</div>
                                        <div
                                            className="text-xl font-bold"
                                            style={{color: VietBusTheme.primary}}
                                        >
                                            Biển số xe: {trip?.licensePlate}
                                        </div>
                                        <div className="font-bold">
                                            {trip?.totalSeat} giường
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">Tài xế</div>
                                        <div
                                            className="text-xl font-bold"
                                            style={{color: VietBusTheme.primary}}
                                        >
                                            <div>
                                                {trip?.driverNames?.map((driver, index) => (
                                                    <div key={index}>{driver}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">Phụ xe</div>
                                        <div
                                            className="text-xl font-bold"
                                            style={{color: VietBusTheme.primary}}
                                        >
                                            <div>
                                                {trip?.assistantNames?.map((assistant, index) => (
                                                    <div key={index}>{assistant}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    {trip?.status === "OPEN_FOR_BOOKING" && (
                        <div className="pb-4 flex justify-end">
                            <Button
                                type="primary"
                                style={{
                                    backgroundColor: VietBusTheme.primary,
                                    color: VietBusTheme.white,
                                }}
                                onClick={() => setOpenAddTicketModal(true)}
                            >
                                Tạo vé
                            </Button>
                        </div>
                    )}
                    <Card></Card>
                </div>
            </div>
            {/* ADD Ticket Modal */}
            {openAddTicketModal && (
                <AddTicketModal
                    open={openAddTicketModal}
                    onClose={() => setOpenAddTicketModal(false)}
                    trip={trip}
                    fetchTripById={fetchData}
                />
            )}
            {/* UPDATE Modal */}
            <UpdateTripModal
                open={openUpdateModal}
                trip={trip}
                onClose={() => {
                    setOpenUpdateModal(false);
                }}
                onSuccess={async () => {
                    const res = await getTripById({tripId});
                    setTrip(res?.data);
                }}
            />
        </Spin>
    );
};

export default TripDetail;
