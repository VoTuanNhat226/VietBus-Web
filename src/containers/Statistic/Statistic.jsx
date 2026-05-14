import React, { useEffect, useState } from "react";
import { Card, Row, Col, List, Typography, Spin } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import * as StatisticsService from "../../services/StatisticsService";
import moment from "moment";

const { Title, Text } = Typography;

const Statistic = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [topRoutes, setTopRoutes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const currentMonth = moment().format("YYYY-MM");
        const ticketPerRouteRes =
          await StatisticsService.getTotalTicketPerRoute({
            month: currentMonth,
          });

        if (ticketPerRouteRes?.data) {
          const sortedRoutes = [...ticketPerRouteRes.data].sort(
            (a, b) => b.total - a.total,
          );
          setTopRoutes(
            sortedRoutes.map((item) => ({
              name: `${item.fromStation} - ${item.toStation}`,
              bookings: item.total,
            })),
          );
        }
      } catch (error) {
        console.error("Lấy dữ liệu thống kê thất bại:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Spin spinning={isLoading}>
      <div className="p-6 min-h-full">
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={12}>
            <Card
              title={
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  Tuyến xe phổ biến
                </Title>
              }
              bordered={false}
              className="rounded-3xl shadow-sm"
            >
              <List
                dataSource={topRoutes}
                renderItem={(item) => (
                  <div className="mb-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-white transition-all cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                          <EnvironmentOutlined
                            style={{ color: "#1890ff", fontSize: "18px" }}
                          />
                        </div>
                        <Text strong className="text-base">
                          {item.name}
                        </Text>
                      </div>
                      <div className="text-right">
                        <div
                          style={{ color: "#1890ff" }}
                          className="font-bold text-base"
                        >
                          {item.bookings} Vé
                        </div>
                      </div>
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

export default Statistic;
