import {VietBusTheme} from "../constants/VietBusTheme";
import {useAuth} from "../context/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";
import {useMemo, useState} from "react";
import AccountDetailModal from "../containers/Account/Modal/AccountDetailModal";
import {MenuItem} from "./MenuItem.js";

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {user, logout, loading} = useAuth();

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
        return filteredMenu.map((item, index) => {
            if (item.type === "section") {
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
                    className={`cursor-pointer rounded-lg px-2 py-2 transition-all duration-200
                        ${location.pathname === item.path
                        ? "bg-[#71a0cf]"
                        : "hover:bg-[#71a0cf]"
                    }`}
                >
                    <i className={`fa-solid ${item.icon} px-2`}></i>
                    {item.label}
                </li>
            );
        });
    };

    return (
        <>
            <div
                className="fixed top-0 left-0 h-screen w-60 flex flex-col text-white shadow-xl z-50"
                style={{backgroundColor: VietBusTheme.primary}}
            >
                <div className="text-center text-3xl font-bold mt-4 mb-4">
                    <i className="fa-solid fa-bus-simple px-2"></i>VIETBUS
                </div>
                {/* SideBar items */}
                <ul className="flex-1 overflow-y-auto p-4 space-y-2">
                    {renderMenu()}
                </ul>
                <ul className="p-4 space-y-2">
                    <li
                        className="cursor-pointer rounded-lg px-2 py-2 hover:scale-110"
                        onClick={() => setOpenProfile(true)}
                    >
                        <i className="fa-solid fa-user px-2"></i>
                        <span className="flex-1">Profile: {user?.username}</span>
                    </li>
                    <li
                        className="cursor-pointer rounded-lg px-2 py-2 hover:scale-110"
                        onClick={handleLogout}
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket px-2"></i>
                        Đăng xuất
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
