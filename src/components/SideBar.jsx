import {VietBusTheme} from "../constants/VietBusTheme";
import {useAuth} from "../context/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";
import {useMemo, useState} from "react";
import AccountDetailModal from "../containers/Account/Modal/AccountDetailModal";
import {MenuItem} from "./MenuItem.js";

const SideBar = ({collapsed, onToggle}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const [openProfile, setOpenProfile] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const filteredMenu = useMemo(() => {
        return MenuItem.filter((item, index) => {
            const hasPermission =
                item.roles.includes("ALL") || item.roles.includes(user?.role);

            if (!hasPermission) return false;

            if (item.type === "section") {
                const hasChild = MenuItem.slice(index + 1).some(nextItem =>
                    nextItem.type === "item" &&
                    (nextItem.roles.includes("ALL") || nextItem.roles.includes(user?.role))
                );
                return hasChild;
            }

            return true;
        });
    }, [user]);

    const renderMenu = () => {
        return filteredMenu.map((item) => {
            if (item.type === "section") {
                if (collapsed) return null;
                return (
                    <li
                        key={item.label}
                        className="rounded-lg px-4 py-2 text-xs"
                        style={{color: VietBusTheme.secondary}}
                    >
                        {item.label}
                    </li>
                );
            }
            return (
                <li
                    key={item.label}
                    onClick={() => {
                        if (location.pathname !== item.path) {
                            navigate(item.path);
                        }
                    }}
                    title={collapsed ? item.label : undefined}
                    className={`cursor-pointer rounded-lg px-2 py-2 transition-all duration-200 flex items-center
                        ${collapsed ? "justify-center" : ""}
                        ${location.pathname === item.path
                        ? "bg-[#71a0cf]"
                        : "hover:bg-[#71a0cf]"
                    }`}
                >
                    <i className={`fa-solid ${item.icon} ${collapsed ? "" : "px-2"}`}></i>
                    {!collapsed && <span className="ml-1">{item.label}</span>}
                </li>
            );
        });
    };

    return (
        <>
            <div
                className="fixed top-0 left-0 h-screen flex flex-col text-white shadow-xl z-50 transition-all duration-300"
                style={{
                    backgroundColor: VietBusTheme.primary,
                    width: collapsed ? "4rem" : "15rem",
                }}
            >
                {/* Logo + Toggle */}
                <div
                    className={`flex items-center mt-4 mb-4 px-2 ${collapsed ? "justify-center" : "justify-between px-4"}`}>
                    {!collapsed && (
                        <div className="text-2xl font-bold">
                            <i className="fa-solid fa-bus-simple px-2"></i>VIETBUS
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        className="rounded-lg p-1.5 hover:bg-[#71a0cf] transition-colors duration-200 flex items-center justify-center"
                        title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
                    >
                        <i className={`fa-solid ${collapsed ? "fa-chevron-right" : "fa-chevron-left"} text-sm`}></i>
                    </button>
                </div>

                {/* Logo icon only when collapsed */}
                {collapsed && (
                    <div className="text-center text-xl font-bold mb-2">
                        <i className="fa-solid fa-bus-simple"></i>
                    </div>
                )}

                {/* Menu items */}
                <ul className="flex-1 overflow-y-auto p-2 space-y-1">
                    {renderMenu()}
                </ul>

                {/* Bottom: Profile & Logout */}
                <ul className="p-2 space-y-1">
                    <li
                        className={`cursor-pointer rounded-lg px-2 py-2 hover:bg-[#71a0cf] transition-colors duration-200 flex items-center ${collapsed ? "justify-center" : ""}`}
                        onClick={() => setOpenProfile(true)}
                        title={collapsed ? `Profile: ${user?.username}` : undefined}
                    >
                        <i className="fa-solid fa-user"></i>
                        {!collapsed && <span className="ml-2 flex-1">Profile: {user?.username}</span>}
                    </li>
                    <li
                        className={`cursor-pointer rounded-lg px-2 py-2 hover:bg-[#71a0cf] transition-colors duration-200 flex items-center ${collapsed ? "justify-center" : ""}`}
                        onClick={handleLogout}
                        title={collapsed ? "Đăng xuất" : undefined}
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        {!collapsed && <span className="ml-2">Đăng xuất</span>}
                    </li>
                </ul>
            </div>

            {/* MODAL */}
            <AccountDetailModal
                open={openProfile}
                onClose={() => setOpenProfile(false)}
                user={user}
            />
        </>
    );
};

export default SideBar;