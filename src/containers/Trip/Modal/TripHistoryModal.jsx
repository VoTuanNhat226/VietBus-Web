import { Button, Modal, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getTripHistoryByTripId } from "../../../services/TripService";
import { formatDateTime } from "../../../utils/Utils";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { STATUS_TRIP_OPTIONS } from "../../../constants/Constants";

const TripHistoryModal = ({ open, onClose, tripId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (open && tripId) {
        try {
          setIsLoading(true);
          const res = await getTripHistoryByTripId({ tripId });
          setHistoryData(res?.data || []);
        } catch (err) {
          console.error("Failed to fetch trip history:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchHistory();
  }, [open, tripId]);

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Thời gian",
      dataIndex: "changeAt",
      key: "changeAt",
      width: 200,
      align: "center",
      render: (text) => formatDateTime(text),
    },
    {
      title: "Người thực hiện",
      dataIndex: "changeBy",
      key: "changeBy",
      width: 150,
      align: "center",
    },
    {
      title: "Trạng thái mới",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const option = STATUS_TRIP_OPTIONS.find((opt) => opt.value === status);
        return <div>{option?.label || status}</div>;
      },
    },
  ];

  return (
    <Modal
      title={
        <div style={{ color: VietBusTheme.primary, fontSize: "20px" }}>
          LỊCH SỬ CẬP NHẬT TRẠNG THÁI CHUYẾN XE
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      <Table
        loading={isLoading}
        dataSource={historyData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Modal>
  );
};

export default TripHistoryModal;
