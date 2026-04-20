import { Button, Modal } from "antd";
import { VietBusTheme } from "../constants/VietBusTheme";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import AccountDetailModal from "../containers/Account/Modal/AccountDetailModal";
import { MenuItem } from "./MenuItem.js";

const SideBar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleLogout = () => {
    setOpenLogoutModal(true);
  };

  const confirmLogout = async () => {
    await logout();
    navigate("/login");
  };

  const filteredMenu = useMemo(() => {
    return MenuItem.filter((item, index) => {
      const hasPermission =
        item.roles.includes("ALL") || item.roles.includes(user?.role);

      if (!hasPermission) return false;

      if (item.type === "section") {
        const hasChild = MenuItem.slice(index + 1).some(
          (nextItem) =>
            nextItem.type === "item" &&
            (nextItem.roles.includes("ALL") ||
              nextItem.roles.includes(user?.role)),
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
            className={`px-6 py-2 text-xs transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"}`}
            style={{ color: VietBusTheme.secondary }}
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
          className={`cursor-pointer rounded-lg mx-2 my-1 py-2 transition-all duration-300 flex items-center
                        ${
                          (
                            item.path === "/"
                              ? location.pathname === "/"
                              : location.pathname.startsWith(item.path)
                          )
                            ? "bg-[#71a0cf]"
                            : "hover:bg-[#71a0cf]"
                        }`}
        >
          <div className="w-10 flex justify-center items-center shrink-0">
            <i className={`fa-solid ${item.icon} text-lg`}></i>
          </div>
          <span
            className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100 ml-2"}`}
          >
            {item.label}
          </span>
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
          width: collapsed ? "3.5rem" : "15rem",
        }}
      >
        {/* Logo + Toggle */}
        <div
          className={`flex items-center mt-4 mb-4 transition-all duration-300 ${collapsed ? "justify-center" : "px-4 justify-between"}`}
        >
          <div className="flex items-center overflow-hidden">
            <div
              className={`flex justify-center items-center shrink-0 transition-all duration-300 overflow-hidden ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100 w-10"}`}
            >
              <i className="fa-solid fa-bus-simple text-2xl"></i>
            </div>
            <div
              className={`text-2xl font-bold transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100 ml-2"}`}
            >
              VIETBUS
            </div>
          </div>
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 hover:bg-[#71a0cf] transition-all duration-300 flex items-center justify-center shrink-0"
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            <i
              className={`fa-solid ${collapsed ? "fa-chevron-right" : "fa-chevron-left"} text-sm`}
            ></i>
          </button>
        </div>

        {/* Menu items */}
        <ul className="flex-1 overflow-y-auto space-y-1">{renderMenu()}</ul>

        {/* Bottom: Profile & Logout */}
        <ul className="mx-2 my-2 space-y-1">
          <li
            className="cursor-pointer rounded-lg py-2 hover:bg-[#71a0cf] transition-all duration-300 flex items-center"
            onClick={() => setOpenProfile(true)}
            title={collapsed ? `Profile: ${user?.username}` : undefined}
          >
            <div className="w-10 flex justify-center items-center shrink-0">
              <i className="fa-solid fa-user"></i>
            </div>
            <span
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100 ml-2 flex-1"}`}
            >
              Profile: {user?.username}
            </span>
          </li>
          <li
            className="cursor-pointer rounded-lg py-2 hover:bg-[#71a0cf] transition-all duration-300 flex items-center"
            onClick={handleLogout}
            title={collapsed ? "Đăng xuất" : undefined}
          >
            <div className="w-10 flex justify-center items-center shrink-0">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </div>
            <span
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100 ml-2"}`}
            >
              Đăng xuất
            </span>
          </li>
        </ul>
      </div>

      {/* MODAL */}
      <AccountDetailModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        user={user}
      />

      {/* LOGOUT MODAL */}
      <Modal
        open={openLogoutModal}
        footer={
          <div className="flex justify-center">
            <Button
              className="mr-2"
              onClick={() => {
                setOpenLogoutModal(false);
              }}
            >
              Đóng
            </Button>
            <Button
              type="primary"
              className="ml-2"
              style={{
                backgroundColor: VietBusTheme.primary,
                color: VietBusTheme.white,
              }}
              onClick={confirmLogout}
            >
              Đăng xuất
            </Button>
          </div>
        }
        onCancel={() => {
          setOpenLogoutModal(false);
        }}
        width={400}
      >
        <div className="flex flex-col items-center gap-2">
          <h2>
            <i
              className="fa-solid fa-triangle-exclamation pr-2"
              style={{
                color: VietBusTheme.error,
                fontSize: 14,
              }}
            />
            Cảnh báo
          </h2>
          <p>Bạn có chắc chắn muốn đăng xuất không?</p>
        </div>
      </Modal>
    </>
  );
};

export default SideBar;
