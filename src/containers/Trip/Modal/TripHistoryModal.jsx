import {
  CloseOutlined,
  HistoryOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Divider, Modal, Table } from "antd";
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const option = STATUS_TRIP_OPTIONS.find((opt) => opt.value === status);
        return <div className="font-medium">{option?.label || status}</div>;
      },
    },
  ];

  const modalTitle = (
    <div className="flex items-center gap-3 pb-3">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{
          backgroundColor: `${VietBusTheme.primary}15`,
          color: VietBusTheme.primary,
        }}
      >
        <HistoryOutlined className="text-xl" />
      </div>
      <span className="text-lg font-bold text-gray-800 uppercase tracking-wide">
        Lịch sử cập nhật trạng thái
      </span>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="rounded-xl overflow-hidden"
      closeIcon={
        <div className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors flex items-center justify-center">
          <CloseOutlined className="text-gray-500 text-sm" />
        </div>
      }
      destroyOnClose
    >
      <div className="mb-4 p-4 rounded-xl border shadow-sm bg-blue-50/50 border-blue-100">
        <Table
          loading={isLoading}
          dataSource={historyData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          size="large"
          className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
          onClick={onClose}
        >
          Đóng
        </Button>
      </div>
    </Modal>
  );
};

export default TripHistoryModal;
