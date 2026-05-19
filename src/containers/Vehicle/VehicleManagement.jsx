import { Form, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllVehicle } from "../../services/VehicleService";
import { VietBusTheme } from "../../constants/VietBusTheme";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../context/PageTitleContext.jsx";
import { formatDateTime } from "../../utils/Utils.js";
import { DoubleRightOutlined } from "@ant-design/icons";

const VehicleManagement = () => {
  const { user } = useAuth();
  const { setTitle } = usePageTitle();
  const navigate = useNavigate();
  const [formInstance] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [listVehicle, setListVehicle] = useState([]);

  useEffect(() => {
    const fetchAllVehicle = async () => {
      try {
        setIsLoading(true);
        const res = await getAllVehicle({});
        setListVehicle(res?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllVehicle();
  }, []);

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
        title: "Biển số xe",
        dataIndex: "licensePlate",
        key: "licensePlate",
        align: "center",
      },
      {
        title: "Số ghế",
        dataIndex: "totalSeat",
        key: "totalSeat",
        align: "center",
      },
      {
        title: "Trạng thái",
        dataIndex: "active",
        key: "active",
        align: "center",
        render: (value) => (
          <span
            style={{
              color:
                value === false ? VietBusTheme.error : VietBusTheme.success,
            }}
          >
            {value === true ? "Hoạt động" : "Không hoạt động"}
          </span>
        ),
      },
      {
        title: "Người tạo",
        dataIndex: "createdBy",
        key: "createdBy",
        align: "center",
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "center",
        render: (value) => (value ? formatDateTime(value) : ""),
      },
      {
        title: "Người cập nhật",
        dataIndex: "updatedBy",
        key: "updatedBy",
        align: "center",
      },
      {
        title: "Ngày cập nhật",
        dataIndex: "updatedAt",
        key: "updatedAt",
        align: "center",
        render: (value) => (value ? formatDateTime(value) : ""),
      },
      {
        title: "Chi tiết",
        key: "action",
        align: "center",
        render: (_, record) => (
          <div className="flex justify-evenly">
            <DoubleRightOutlined
              style={{
                color: VietBusTheme.primary,
                fontSize: 18,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/vehicle/${record.vehicleId}`)}
            />
          </div>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div>
      <Table
        rowKey="vehicleId"
        className="pt-4"
        loading={isLoading}
        dataSource={listVehicle}
        columns={columns}
      />
    </div>
  );
};

export default VehicleManagement;
