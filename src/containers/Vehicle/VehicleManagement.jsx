import {Form, Table} from "antd";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext";
import {getAllVehicle} from "../../services/VehicleService";
import {VietBusTheme} from "../../constants/VietBusTheme";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {usePageTitle} from "../../context/PageTitleContext.jsx";

const VehicleManagement = () => {
    const [formInstance] = Form.useForm();

    const [listVehicle, setListVehicle] = useState([]);

    const {user} = useAuth();

    const {setTitle} = usePageTitle();

    useEffect(() => {
        setTitle("QUẢN LÝ XE");
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllVehicle = async () => {
            const res = await getAllVehicle({});
            setListVehicle(res?.data);
        };
        fetchAllVehicle();
    }, []);

    const columns = [
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
        },
        {
            title: "Số ghế",
            dataIndex: "totalSeat",
            key: "totalSeat",
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            key: "active",
            render: (value) => (
                <span
                    style={{
                        color: value === false ? VietBusTheme.error : VietBusTheme.success,
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
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value) =>
                value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
        },
        {
            title: "Người cập nhật",
            dataIndex: "updatedBy",
            key: "updatedBy",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (value) =>
                value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
        },
        {
            title: "Chi tiết",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div className="flex justify-evenly">
                    <i
                        className="fa-solid fa-angles-right"
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
    ];

    return (
        <div>
            <Table className="pt-4" dataSource={listVehicle} columns={columns}/>
        </div>
    );
};

export default VehicleManagement;
