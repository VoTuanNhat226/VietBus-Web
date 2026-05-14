import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Typography,
  Space,
  Button,
  List,
  Avatar,
  Progress,
  Spin,
} from "antd";
import {
  DollarOutlined,
  UserOutlined,
  RocketOutlined,
  FileProtectOutlined,
  ArrowUpOutlined,
  CarOutlined,
  NotificationOutlined,
  ArrowRightOutlined,
  PieChartOutlined,
  NumberOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { VietBusTheme } from "../constants/VietBusTheme";
import { useAuth } from "../context/AuthContext";
import * as StatisticsService from "../services/StatisticsService";
import * as TripService from "../services/TripService";
import * as TripSeatService from "../services/TripSeatService";
import * as TicketService from "../services/TicketService";
import moment from "moment";

const { Title, Text } = Typography;

const Home = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    revenue: 0,
    revenuePrev: 0,
    growthPercent: 0,
    totalTicket: 0,
    totalTicketPrev: 0,
    growthTicketPercent: 0,
    totalTrip: 0,
    totalTripPrev: 0,
    growthTripPercent: 0,
    totalPassenger: 0,
    totalPassengerPrev: 0,
    growthPassengerPercent: 0,
  });

  const [tripDeparted, setTripDeparted] = useState([]);
  const [tripSelling, setTripSelling] = useState([]);
  const [totalUnpaidTicket, setTotalUnpaidTicket] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const currentMonth = moment().format("YYYY-MM");
        const [
          revenueRes,
          ticketRes,
          tripRes,
          tripDepartedRes,
          passengerRes,
          tripSellingRes,
          unpaidTicketRes,
        ] = await Promise.all([
          StatisticsService.getRevenueByMonth({ month: currentMonth }),
          StatisticsService.getTotalTicketByMonth({ month: currentMonth }),
          StatisticsService.getTotalTripByMonth({ month: currentMonth }),
          StatisticsService.getAllTripDeparted({}),
          StatisticsService.getTotalPassengerByMonth({ month: currentMonth }),
          TripService.getAllTripOpenBooking({}),
          TicketService.getAllTicketsUnpaid({}),
        ]);

        setStatistics((prev) => {
          const newState = { ...prev };
          if (revenueRes?.data) {
            Object.keys(revenueRes.data).forEach((key) => {
              if (
                revenueRes.data[key] !== null &&
                revenueRes.data[key] !== undefined
              ) {
                newState[key] = revenueRes.data[key];
              }
            });
          }
          if (ticketRes?.data) {
            Object.keys(ticketRes.data).forEach((key) => {
              if (
                ticketRes.data[key] !== null &&
                ticketRes.data[key] !== undefined
              ) {
                newState[key] = ticketRes.data[key];
              }
            });
          }
          if (tripRes?.data) {
            Object.keys(tripRes.data).forEach((key) => {
              if (
                tripRes.data[key] !== null &&
                tripRes.data[key] !== undefined
              ) {
                newState[key] = tripRes.data[key];
              }
            });
          }
          if (passengerRes?.data) {
            Object.keys(passengerRes.data).forEach((key) => {
              if (
                passengerRes.data[key] !== null &&
                passengerRes.data[key] !== undefined
              ) {
                newState[key] = passengerRes.data[key];
              }
            });
          }
          return newState;
        });
        if (unpaidTicketRes?.data) {
          setTotalUnpaidTicket(
            Array.isArray(unpaidTicketRes.data)
              ? unpaidTicketRes.data.length
              : unpaidTicketRes.data,
          );
        }
        if (tripDepartedRes?.data) {
          const tripsWithSeats = await Promise.all(
            tripDepartedRes.data.map(async (trip) => {
              try {
                const soldRes = await TripSeatService.countTripSeatSoldByTripId(
                  {
                    tripId: trip.tripId,
                  },
                );
                return { ...trip, tripSeatSold: soldRes.data };
              } catch (e) {
                return trip;
              }
            }),
          );
          setTripDeparted(tripsWithSeats);
        }

        if (tripSellingRes?.data) {
          const tripsWithSeats = await Promise.all(
            tripSellingRes.data.map(async (trip) => {
              try {
                const soldRes = await TripSeatService.countTripSeatSoldByTripId(
                  {
                    tripId: trip.tripId,
                  },
                );
                return { ...trip, tripSeatSold: soldRes.data };
              } catch (e) {
                return trip;
              }
            }),
          );
          setTripSelling(tripsWithSeats);
        }
      } catch (error) {
        console.error("Lấy dữ liệu thống kê thất bại:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: "Tổng doanh thu",
      value: statistics.revenue,
      prefix: <DollarOutlined />,
      suffix: "VNĐ",
      color: VietBusTheme.primary,
      trend: `${statistics.growthPercent > 0 ? "+" : ""}${statistics.growthPercent}%`,
    },
    {
      title: "Vé đã bán",
      value: statistics.totalTicket,
      prefix: <FileProtectOutlined />,
      color: VietBusTheme.success,
      trend: `${statistics.growthTicketPercent > 0 ? "+" : ""}${statistics.growthTicketPercent}%`,
    },
    {
      title: "Vé chưa thanh toán",
      value: totalUnpaidTicket,
      prefix: <ExclamationCircleOutlined />,
      color: "#faad14",
      trend: `${totalUnpaidTicket} vé`,
      trendType: "warning",
    },
    {
      title: "Chuyến xe",
      value: statistics.totalTrip,
      prefix: <RocketOutlined />,
      color: "#f5222d",
      trend: `${statistics.growthTripPercent > 0 ? "+" : ""}${statistics.growthTripPercent}%`,
    },
    {
      title: "Khách hàng mới",
      value: statistics.totalPassenger,
      prefix: <UserOutlined />,
      color: "#722ed1",
      trend: `${statistics.growthPassengerPercent > 0 ? "+" : ""}${statistics.growthPassengerPercent}%`,
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <div className="p-6 min-h-full">
        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          {stats.map((item, index) => (
            <Col
              xs={24}
              sm={12}
              lg={index < 3 ? 8 : 12}
              xl={4}
              key={index}
              style={{ flex: "0 0 20%", maxWidth: "20%" }}
            >
              <Card
                bordered={false}
                className="rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                      }}
                    >
                      {React.cloneElement(item.prefix, {
                        style: { fontSize: "22px" },
                      })}
                    </div>
                    <Text
                      type="secondary"
                      className="uppercase font-bold text-[11px] tracking-widest"
                    >
                      {item.title}
                    </Text>
                    <div className="mt-1">
                      <Statistic
                        value={item.value}
                        suffix={item.suffix}
                        valueStyle={{
                          color: VietBusTheme.black,
                          fontWeight: 800,
                          fontSize: "28px",
                        }}
                      />
                    </div>
                    <div className="mt-2">
                      <Tag
                        color={
                          item.trendType === "warning"
                            ? "warning"
                            : item.trend.startsWith("+")
                              ? "success"
                              : "error"
                        }
                        className="rounded-full border-none px-2 font-bold"
                      >
                        {item.trend}
                      </Tag>
                      {item.title !== "Vé chưa thanh toán" && (
                          <Text className="text-[12px] text-gray-400 ml-1">
                            tháng này
                          </Text>
                        )}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 24]}>
          {/* Active Trips List */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Chuyến đang chạy
                </Title>
              }
              bordered={false}
              className="rounded-3xl shadow-sm"
              extra={<Tag color="processing">{tripDeparted.length} chuyến</Tag>}
            >
              <List
                dataSource={tripDeparted}
                renderItem={(item) => (
                  <div className="mb-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-white transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <Text strong className="text-base">
                        {item.fromStation} - {item.toStation}
                      </Text>
                      <div className="flex flex-col items-end">
                        <Text
                          style={{ color: "#1890ff" }}
                          className="font-bold"
                        >
                          {moment(item.departureTime).format(
                            "HH:mm DD-MM-YYYY",
                          )}
                        </Text>
                        <Text
                          style={{ color: "#1890ff" }}
                          className="font-bold"
                        >
                          {moment(item.arrivalTime).format("HH:mm DD-MM-YYYY")}
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar
                        size="small"
                        icon={<NumberOutlined style={{ color: "#1890ff" }} />}
                        className="bg-blue-50"
                      />
                      <Text className="text-xs font-medium text-gray-700">
                        Mã chuyến: {item.tripCode}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar
                        size="small"
                        icon={<UserOutlined style={{ color: "#1890ff" }} />}
                        className="bg-blue-50"
                      />
                      <Text className="text-xs font-medium text-gray-700">
                        Tài xế: {item.driverNames?.join(", ")}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar
                        size="small"
                        icon={<UserOutlined style={{ color: "#1890ff" }} />}
                        className="bg-blue-50"
                      />
                      <Text className="text-xs font-medium text-gray-700">
                        Phụ xe: {item.assistantNames?.join(", ")}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        icon={<CarOutlined style={{ color: "#1890ff" }} />}
                        className="bg-orange-50"
                      />
                      <Text className="text-xs font-medium text-gray-700">
                        Biển số: {item.licensePlate}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar
                        size="small"
                        icon={<PieChartOutlined style={{ color: "#1890ff" }} />}
                        className="bg-blue-50"
                      />
                      <Text className="text-xs font-medium text-gray-700">
                        Ghế: {item.tripSeatSold || 0}/{item.totalSeat || 0}
                      </Text>
                    </div>
                  </div>
                )}
              />
            </Card>
          </Col>

          {/* Trips Open for Booking */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Chuyến đang mở bán
                </Title>
              }
              bordered={false}
              className="rounded-3xl shadow-sm"
              extra={<Tag color="processing">{tripSelling.length} chuyến</Tag>}
            >
              <List
                dataSource={tripSelling}
                renderItem={(item) => (
                  <div className="mb-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-white transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <Text strong className="text-base">
                        {item.fromStation} - {item.toStation}
                      </Text>
                      <div className="flex flex-col items-end">
                        <Text
                          style={{ color: "#1890ff" }}
                          className="font-bold"
                        >
                          {moment(item.departureTime).format(
                            "HH:mm DD-MM-YYYY",
                          )}
                        </Text>
                        <Text
                          style={{ color: "#1890ff" }}
                          className="font-bold"
                        >
                          {moment(item.arrivalTime).format("HH:mm DD-MM-YYYY")}
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar
                        size="small"
                        icon={<NumberOutlined style={{ color: "#1890ff" }} />}
                        className="bg-blue-50"
                      />
                      <Text className="text-xs font-medium text-gray-700">
                        Mã chuyến: {item.tripCode}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar
                        size="small"
                        icon={<UserOutlined style={{ color: "#1890ff" }} />}
                        className="bg-blue-50"
                      />
                      <Text className="text-xs font-medium text-gray-700">
                        Tài xế: {item.driverNames?.join(", ")}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar
                        size="small"
                        icon={<UserOutlined style={{ color: "#1890ff" }} />}
                        className="bg-blue-50"
                      />
                      <Text className="text-xs font-medium text-gray-700">
                        Phụ xe: {item.assistantNames?.join(", ")}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        icon={<CarOutlined style={{ color: "#1890ff" }} />}
                        className="bg-blue-50"
                      />
                      <Text className="text-xs font-medium text-gray-700">
                        Biển số: {item.licensePlate}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar
                        size="small"
                        icon={<PieChartOutlined style={{ color: "#1890ff" }} />}
                        className="bg-blue-50"
                      />
                      <Text className="text-xs font-medium text-gray-700">
                        Ghế: {item.tripSeatSold || 0}/{item.totalSeat || 0}
                      </Text>
                    </div>
                  </div>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Home;
