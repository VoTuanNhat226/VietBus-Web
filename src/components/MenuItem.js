export const MenuItem = [
    // ================= DASHBOARD =================
    {
        type: "item",
        label: "Tổng quan",
        icon: "fa-house",
        path: "/",
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
        section: "MAIN",
    },
    // ================= QUẢN LÝ =================
    {
        type: "section",
        label: "QUẢN LÝ",
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
    {
        type: "item",
        label: "Tài khoản",
        icon: "fa-circle-user",
        path: "/account",
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
    {
        type: "item",
        label: "Nhân viên",
        icon: "fa-user-group",
        path: "/employee",
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
    {
        type: "item",
        label: "Khách hàng",
        icon: "fa-users",
        path: "/passenger",
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
    {
        type: "item",
        label: "Tuyến xe",
        icon: "fa-route",
        path: "/route",
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
    {
        type: "item",
        label: "Xe",
        icon: "fa-bus-simple",
        path: "/vehicle",
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
    // ================= HOẠT ĐỘNG =================
    {
        type: "section",
        label: "HOẠT ĐỘNG",
        roles: ["ALL"],
    },
    {
        type: "item",
        label: "Chuyến xe",
        icon: "fa-suitcase-rolling",
        path: "/trip",
        roles: ["ALL"],
    },
    {
        type: "item",
        label: "Vé xe",
        icon: "fa-ticket",
        path: "/ticket",
        roles: ["ALL"],
    },
    {
        type: "item",
        label: "Vé chưa thanh toán",
        icon: "fa-clock",
        path: "/pending-ticket",
        roles: ["ALL"],
    },
    // ================= TÀI CHÍNH =================
    {
        type: "section",
        label: "TÀI CHÍNH",
        roles: ["ALL"],
    },
    {
        type: "item",
        label: "Lịch sử thanh toán",
        icon: "fa-credit-card",
        path: "/payment",
        roles: ["ALL"],
    },
    // ================= PHÂN TÍCH =================
    {
        type: "section",
        label: "PHÂN TÍCH",
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
    {
        type: "item",
        label: "Thống kê",
        icon: "fa-chart-column",
        path: "/statistic",
        roles: ["ROLE_ADMIN", "ROLE_MANAGER"],
    },
];