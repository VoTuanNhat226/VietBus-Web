import {
    CarOutlined,
    DollarOutlined,
    HomeOutlined,
    LineChartOutlined,
    MenuOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {VietBusTheme} from "../constants/VietBusTheme";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

const Menu = () => {
    const navigate = useNavigate();
    const {user, logout, loading} = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div
            className="fixed top-0 left-0 h-screen w-60 from-slate-900 to-slate-800 text-white shadow-xl z-50"
            style={{backgroundColor: VietBusTheme.primary}}
        >
            {/* Menu items */}
            <ul className="p-4 space-y-2">
                <li
                    className="cursor-pointer rounded-lg px-4 py-2 transition-transform duration-200 hover:scale-110"
                    onClick={() => navigate("/")}
                >
                    <i className="fa-solid fa-house px-2"></i>
                    Trang chủ
                </li>
                <li className="cursor-pointer rounded-lg px-4 py-2 transition-transform duration-200 hover:scale-110">
                    <i className="fa-solid fa-list px-2"></i>
                    Quản lý
                </li>
                <li className="cursor-pointer rounded-lg px-8 py-2 transition-transform duration-200 hover:scale-110"
                    onClick={() => navigate("/account")}>
                    <i className="fa-solid fa-user px-2"></i>
                    Tài khoản
                </li>
                <li
                    className="cursor-pointer rounded-lg px-8 py-2 transition-transform duration-200 hover:scale-110"
                    onClick={() => navigate("/employee")}
                >
                    <i className="fa-solid fa-user-group px-2"></i>
                    Nhân viên
                </li>
                <li
                    className="cursor-pointer rounded-lg px-8 py-2 transition-transform duration-200 hover:scale-110"
                    onClick={() => navigate("/route")}
                >
                    <i className="fa-solid fa-route px-2"></i>Tuyến xe
                </li>
                <li
                    className="cursor-pointer rounded-lg px-8 py-2 transition-transform duration-200 hover:scale-110"
                    onClick={() => navigate("/trip")}
                >
                    <i className="fa-solid fa-suitcase-rolling px-2"></i>Chuyến xe
                </li>
                <li
                    className="cursor-pointer rounded-lg px-8 py-2 transition-transform duration-200 hover:scale-110"
                    onClick={() => navigate("/ticket")}
                >
                    <i className="fa-solid fa-ticket px-2"></i>Vé xe
                </li>
                <li
                    className="cursor-pointer rounded-lg px-8 py-2 transition-transform duration-200 hover:scale-110"
                    onClick={() => navigate("/vehicle")}
                >
                    <i className="fa-solid fa-bus-simple px-2"></i>
                    Xe
                </li>
                <li
                    className="cursor-pointer rounded-lg px-4 py-2 transition-transform duration-200 hover:scale-110"
                    onClick={() => navigate("/payment")}
                >
                    <i className="fa-regular fa-credit-card px-2"></i>
                    Thanh toán
                </li>
                <li
                    className="cursor-pointer rounded-lg px-4 py-2 transition-transform duration-200 hover:scale-110"
                    onClick={() => navigate("/statistic")}
                >
                    <i className="fa-solid fa-chart-column px-2"></i>
                    Thống kê
                </li>
                <li className="cursor-pointer rounded-lg px-4 py-2 transition-transform duration-200 hover:scale-110">
                    <i className="fa-solid fa-user px-2"></i>
                    <span className="flex-1">Profile: {user?.username}</span>
                </li>
                <li
                    className="cursor-pointer rounded-lg px-4 py-2 transition-transform duration-200 hover:scale-110"
                    onClick={handleLogout}
                >
                    <i className="fa-solid fa-arrow-right-from-bracket px-2"></i>
                    Đăng xuất
                </li>
            </ul>
        </div>
    );
};

export default Menu;
