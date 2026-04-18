import { useParams } from "react-router-dom";
import { usePageTitle } from "../../context/PageTitleContext";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { VietBusTheme } from "../../constants/VietBusTheme";
import { Button, Card, Divider, Dropdown, Spin, Table } from "antd";

import { getTripById } from "../../services/TripService";
import {
  countTripSeatSoldByTripId,
  getAllTripSeatByTripId,
} from "../../services/TripSeatService";
import moment from "moment";
import SeatMap40 from "../Vehicle/Seat/SeatMap40.jsx";
import {
  CarOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  STATUS_TRIP_OPTIONS,
  TICKET_STATUS_OPTION,
} from "../../constants/Constants.js";
import UpdateTripModal from "./Modal/UpdateTripModal.jsx";
import SeatMap34 from "../Vehicle/Seat/SeatMap34.jsx";
import AddTicketModal from "../Ticket/Modal/AddTicketModal.jsx";
import SeatMap24 from "../Vehicle/Seat/SeatMap24.jsx";
import { getAllTicketsByTripId } from "../../services/TicketService.js";
import { formatDateTime } from "../../utils/Utils.js";

const TripDetail = () => {
  const { tripId } = useParams();
  const { setTitle, setHeaderAction } = usePageTitle();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [openAddTicketModal, setOpenAddTicketModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [trip, setTrip] = useState(null);
  const [listTripSeat, setListTripSeat] = useState([]);
  const [listTickets, setListTickets] = useState([]);
  const [expectedRevenue, setExpectedRevenue] = useState(0);
  const [tripSeatSold, setTripSeatSold] = useState(0);

  const actualRevenue = useMemo(() => {
    return listTickets.reduce(
      (sum, ticket) => sum + (ticket.ticketPrice || 0),
      0,
    );
  }, [listTickets]);

  useEffect(() => {
    setTitle("CHI TIẾT CHUYẾN XE");
    return () => {
      setHeaderAction(null);
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [tripRes, soldRes, seatRes, ticketRes] = await Promise.all([
      getTripById({ tripId }),
      countTripSeatSoldByTripId({ tripId }),
      getAllTripSeatByTripId({ tripId }),
      getAllTicketsByTripId({ tripId }),
    ]);

    const tripData = tripRes?.data;

    setTrip(tripData);
    setTripSeatSold(soldRes?.data || 0);
    setListTripSeat(seatRes?.data || []);
    setListTickets(ticketRes?.data || []);

    const price = tripData?.price || 0;
    const totalSeat = tripData.totalSeat || 0;
    setExpectedRevenue(price * totalSeat);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [tripId]);

  const canUpdate =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER";
  const canCreateTicket =
    user?.role === "ROLE_ADMIN" ||
    user?.role === "ROLE_MANAGER" ||
    user?.role === "ROLE_STAFF";

  useEffect(() => {
    setHeaderAction(
      <div style={{ display: "flex", gap: "8px" }}>
        {canCreateTicket && trip?.status === "OPEN_FOR_BOOKING" && (
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
        )}
        {canUpdate && (
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
        )}
      </div>,
    );
  }, [trip?.status, canUpdate, canCreateTicket]);

  const fillRate =
    trip?.totalSeat > 0 ? Math.round((tripSeatSold / trip.totalSeat) * 100) : 0;

  const statusLabel =
    STATUS_TRIP_OPTIONS.find((opt) => opt.value === trip?.status)?.label ||
    trip?.status;

  const renderSeatMap = useMemo(() => {
    switch (trip?.totalSeat) {
      case 40:
        return <SeatMap40 listTripSeat={listTripSeat} title="TÌNH TRẠNG VÉ" />;
      case 34:
        return <SeatMap34 listTripSeat={listTripSeat} title="TÌNH TRẠNG VÉ" />;
      case 24:
        return <SeatMap24 listTripSeat={listTripSeat} title="TÌNH TRẠNG VÉ" />;
      default:
        return null;
    }
  }, [trip?.totalSeat, listTripSeat]);

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
        title: "Mã vé",
        dataIndex: "ticketCode",
        key: "ticketCode",
      },
      {
        title: "Số ghế",
        dataIndex: "seatNumber",
        key: "seatNumber",
      },
      {
        title: "Giá bán",
        dataIndex: "ticketPrice",
        key: "ticketPrice",
        render: (price) =>
          `${new Intl.NumberFormat("vi-VN").format(price)} VNĐ`,
      },
      {
        title: "Trạng thái vé",
        dataIndex: "ticketStatus",
        key: "ticketStatus",
        render: (status) =>
          TICKET_STATUS_OPTION.find((opt) => opt.value === status)?.label ||
          status,
      },
      {
        title: "Người bán",
        dataIndex: "ticketSoldBy",
        key: "ticketSoldBy",
      },
      {
        title: "Ngày ngày bán",
        dataIndex: "ticketSoldAt",
        key: "ticketSoldAt",
        render: (value) => (value ? formatDateTime(value) : ""),
      },
    ],
    [],
  );

  return (
    <Spin spinning={isLoading}>
      <div className="flex justify-evenly">
        <div className="w-3/12 mr-5">
          <Card className="rounded-xl hover:shadow-xl">{renderSeatMap}</Card>
          <Card className="rounded-xl hover:shadow-xl">
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
          <Card className="rounded-xl hover:shadow-xl mb-2">
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
                <div className="text-sm font-bold">Doanh thu thực tế</div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {actualRevenue?.toLocaleString("vi-VN")} VND
                </div>
              </div>
              <div>
                <div className="text-sm font-bold">Vé đã bán</div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {tripSeatSold}/{trip?.totalSeat}
                  <span>({fillRate}%)</span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="rounded-xl hover:shadow-xl mb-2">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="text-sm font-bold">
                  <i className="fa-solid fa-location-dot pr-2" />
                  Khởi hành
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {trip?.fromStation}
                </div>
                <div className="font-bold">
                  {trip?.departureTime &&
                    moment(trip.departureTime).format("HH:mm DD-MM-YYYY")}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">
                  <i className="fa-solid fa-flag pr-2" />
                  Điểm kết thúc
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {trip?.toStation}
                </div>
                <div className="font-bold">
                  {trip?.arrivalTime &&
                    moment(trip.arrivalTime).format("HH:mm DD-MM-YYYY")}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">Thông tin xe</div>
                <div
                  className="text-xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {trip?.licensePlate}
                </div>
                <div className="font-bold">{trip?.totalSeat} giường</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">Tài xế</div>
                <div
                  className="text-xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {trip?.driverNames?.map((driver, index) => (
                    <div key={index}>{driver}</div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">Phụ xe</div>
                <div
                  className="text-xl font-bold"
                  style={{ color: VietBusTheme.primary }}
                >
                  {trip?.assistantNames?.map((assistant, index) => (
                    <div key={index}>{assistant}</div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <Card
            className="rounded-xl hover:shadow-xl mb-2"
            styles={{ body: { padding: "12px 24px" } }}
          >
            <div className="flex justify-between items-center mb-2">
              <div
                className="text-xl font-bold"
                style={{ color: VietBusTheme.primary }}
              >
                DANH SÁCH VÉ
              </div>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "excel",
                      label: "Xuất Excel",
                      icon: <FileExcelOutlined style={{ color: "#1D6F42" }} />,
                    },
                    {
                      key: "pdf",
                      label: "Xuất PDF",
                      icon: <FilePdfOutlined style={{ color: "#E02424" }} />,
                    },
                  ],
                }}
                placement="bottomRight"
              >
                <Button
                  icon={<PrinterOutlined />}
                  style={{
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  In file
                </Button>
              </Dropdown>
            </div>
            <Table
              columns={columns}
              dataSource={listTickets}
              pagination={false}
              scroll={{ y: 468 }}
              size="middle"
            />
          </Card>
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
          const res = await getTripById({ tripId });
          setTrip(res?.data);
        }}
      />
    </Spin>
  );
};

export default TripDetail;
