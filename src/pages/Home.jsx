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
} from "antd";
import {
  DollarOutlined,
  UserOutlined,
  RocketOutlined,
  FileProtectOutlined,
  ArrowUpOutlined,
  EnvironmentOutlined,
  CarOutlined,
  NotificationOutlined,
  ArrowRightOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { VietBusTheme } from "../constants/VietBusTheme";
import { useAuth } from "../context/AuthContext";
import * as StatisticsService from "../services/StatisticsService";
import moment from "moment";

const { Title, Text } = Typography;

const Home = () => {
  const { user } = useAuth();
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
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentMonth = moment().format("YYYY-MM");
        const [revenueRes, ticketRes, tripRes] = await Promise.all([
          StatisticsService.getRevenueByMonth({ month: currentMonth }),
          StatisticsService.getTotalTicketByMonth({ month: currentMonth }),
          StatisticsService.getTotalTripByMonth({ month: currentMonth }),
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
          return newState;
        });
      } catch (error) {
        console.error("Lấy dữ liệu thống kê thất bại:", error);
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
      title: "Chuyến xe",
      value: statistics.totalTrip,
      prefix: <RocketOutlined />,
      color: "#f5222d",
      trend: `${statistics.growthTripPercent > 0 ? "+" : ""}${statistics.growthTripPercent}%`,
    },
    {
      title: "Khách hàng mới",
      value: 320,
      prefix: <UserOutlined />,
      color: "#722ed1",
      trend: "+8.4%",
    },
  ];

  const recentBookings = [
    {
      key: "1",
      customer: "Nguyễn Văn A",
      trip: "Hà Nội - Hải Phòng",
      time: "10:30 20/04/2026",
      amount: "250,000 VNĐ",
      status: "Thành công",
    },
    {
      key: "2",
      customer: "Trần Thị B",
      trip: "Sài Gòn - Đà Lạt",
      time: "14:15 20/04/2026",
      amount: "350,000 VNĐ",
      status: "Chờ thanh toán",
    },
    {
      key: "3",
      customer: "Lê Văn C",
      trip: "Đà Nẵng - Huế",
      time: "08:00 21/04/2026",
      amount: "120,000 VNĐ",
      status: "Thành công",
    },
  ];

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Chuyến xe",
      dataIndex: "trip",
      key: "trip",
      render: (text) => (
        <span>
          <EnvironmentOutlined
            style={{ marginRight: 8, color: VietBusTheme.primary }}
          />
          {text}
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      align: "right",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Thành công" ? "success" : "warning"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const topRoutes = [
    { name: "Hà Nội - Hải Phòng", bookings: 450, growth: 15 },
    { name: "Sài Gòn - Đà Lạt", bookings: 380, growth: 10 },
    { name: "Đà Nẵng - Huế", bookings: 290, growth: -5 },
  ];

  const announcements = [
    {
      title: "Bảo trì hệ thống",
      time: "2 giờ trước",
      type: "warning",
      content: "Hệ thống sẽ bảo trì vào lúc 00:00 ngày mai.",
    },
    {
      title: "Khuyến mãi lễ 30/4",
      time: "5 giờ trước",
      type: "success",
      content: "Chương trình giảm giá 20% cho tất cả các tuyến.",
    },
  ];

  return (
    <div className="p-6 bg-[#f8fafc] min-h-full">
      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        {stats.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
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
                      color={item.trend.startsWith("+") ? "success" : "error"}
                      className="rounded-full border-none px-2 font-bold"
                    >
                      {item.trend}
                    </Tag>
                    <Text className="text-[12px] text-gray-400 ml-1">
                      tháng này
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} xl={16}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {/* Recent Bookings Table */}
            <Card
              title={
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Giao dịch gần đây
                </Title>
              }
              bordered={false}
              className="rounded-3xl shadow-sm"
              extra={
                <Button type="link" className="font-bold">
                  Tất cả <ArrowRightOutlined />
                </Button>
              }
            >
              <Table
                columns={columns}
                dataSource={recentBookings}
                pagination={false}
                className="custom-table"
              />
            </Card>

            {/* Top Routes & Performance */}
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Card
                  title={
                    <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                      Tuyến xe phổ biến
                    </Title>
                  }
                  bordered={false}
                  className="rounded-3xl shadow-sm h-full"
                >
                  <List
                    dataSource={topRoutes}
                    renderItem={(item) => (
                      <List.Item className="border-none px-0">
                        <div className="w-full">
                          <div className="flex justify-between mb-1">
                            <Text strong>{item.name}</Text>
                            <Text type="secondary">{item.bookings} vé</Text>
                          </div>
                          <Progress
                            percent={80 + item.growth}
                            showInfo={false}
                            strokeColor={
                              item.growth > 0
                                ? VietBusTheme.primary
                                : VietBusTheme.error
                            }
                            strokeWidth={8}
                            className="m-0"
                          />
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title={
                    <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                      Tình trạng đội xe
                    </Title>
                  }
                  bordered={false}
                  className="rounded-3xl shadow-sm h-full flex flex-col justify-center items-center py-8"
                >
                  <Progress
                    type="dashboard"
                    percent={92}
                    strokeColor={VietBusTheme.success}
                    format={(percent) => (
                      <div className="flex flex-col">
                        <span style={{ fontSize: "24px", fontWeight: 800 }}>
                          {percent}%
                        </span>
                        <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                          Hoạt động
                        </span>
                      </div>
                    )}
                  />
                  <div className="mt-4 flex gap-4">
                    <Tag color="success">32 Sẵn sàng</Tag>
                    <Tag color="warning">3 Bảo trì</Tag>
                    <Tag color="error">1 Hỏng</Tag>
                  </div>
                </Card>
              </Col>
            </Row>
          </Space>
        </Col>

        {/* Right Column */}
        <Col xs={24} xl={8}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {/* Active Trips List */}
            <Card
              title={
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Chuyến đang chạy
                </Title>
              }
              bordered={false}
              className="rounded-3xl shadow-sm"
              extra={<Tag color="processing">8 chuyến</Tag>}
            >
              <List
                dataSource={[
                  { route: "Hà Nội - Vinh", time: "11:30", driver: "A. Tuấn" },
                  {
                    route: "Đà Nẵng - Quy Nhơn",
                    time: "12:00",
                    driver: "A. Hùng",
                  },
                  {
                    route: "Sài Gòn - Vũng Tàu",
                    time: "12:45",
                    driver: "A. Nam",
                  },
                ]}
                renderItem={(item) => (
                  <div className="mb-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-white transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <Text strong className="text-base">
                        {item.route}
                      </Text>
                      <Text className="text-blue-600 font-bold">
                        {item.time}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar size="small" icon={<UserOutlined />} />
                      <Text type="secondary" className="text-xs">
                        Tài xế: {item.driver}
                      </Text>
                    </div>
                  </div>
                )}
              />
            </Card>

            {/* Announcements */}
            <Card
              title={
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Thông báo
                </Title>
              }
              bordered={false}
              className="rounded-3xl shadow-sm bg-gradient-to-br from-white to-gray-50"
            >
              <List
                itemLayout="horizontal"
                dataSource={announcements}
                renderItem={(item) => (
                  <List.Item className="px-0">
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<PieChartOutlined />}
                          style={{
                            backgroundColor:
                              item.type === "warning" ? "#faad14" : "#52c41a",
                          }}
                        />
                      }
                      title={<Text strong>{item.title}</Text>}
                      description={
                        <div>
                          <div className="text-[11px] text-gray-400 mb-1">
                            {item.time}
                          </div>
                          <div className="text-gray-600 text-xs">
                            {item.content}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
