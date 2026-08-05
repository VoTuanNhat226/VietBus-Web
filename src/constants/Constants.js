export const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "MANAGER", label: "Quản lý" },
  { value: "STAFF", label: "Nhân viên" },
  { value: "DRIVER", label: "Tài xế" },
  { value: "ASSISTANT", label: "Phụ xe" },
];

export const ROLE = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
  DRIVER: "DRIVER",
  ASSISTANT: "ASSISTANT",
};

export const ACTIVE_OPTIONS = [
  { value: true, label: "Hoạt động" },
  { value: false, label: "Không hoạt động" },
];

export const STATUS_TRIP_OPTIONS = [
  { value: "CREATED", label: "Mới tạo" },
  { value: "OPEN_FOR_BOOKING", label: "Đang mở bán" },
  { value: "CLOSED_FOR_BOOKING", label: "Đã ngừng bán" },
  { value: "DEPARTED", label: "Đã xuất bến" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export const TRIP_SEAT_STATUS_OPTION = [
  { value: "AVAILABLE", label: "Trống" },
  { value: "HOLD", label: "Đang giữ" },
  { value: "SOLD", label: "Đã bán" },
];

export const TICKET_STATUS_OPTION = [
  { value: "PAID", label: "Đã thanh toán" },
  { value: "UNPAID", label: "Chưa thanh toán" },
  { value: "CANCELED", label: "Đã hủy" },
];

export const PAYMENT_METHOD_OPTION = [
  { value: "CASH", label: "Tiền mặt" },
  { value: "BANK_TRANSFER", label: "Chuyến khoản" },
  { value: "MOMO", label: "MOMO" },
  { value: "VNPAY", label: "VNPAY" },
  { value: "ZALOPAY", label: "ZALOPAY" },
];

export const PAYMENT_TYPE_OPTION = [
  { value: "PAY_NOW", label: "Trả ngay" },
  { value: "PAY_LATER", label: "Trả sau" },
];

export const PAYMENT_STATUS_OPTION = [
  { value: "PENDING", label: "Đang chờ xử lý" },
  { value: "SUCCESS", label: "Thành công" },
  { value: "FAILED", label: "Thất bại" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
];

export const MAINTENANCE_TYPE_OPTIONS = [
  { value: "PERIODIC_MAINTENANCE", label: "Bảo dưỡng định kỳ" },
  { value: "REPAIR", label: "Sửa chữa" },
  { value: "INSPECTION", label: "Đăng kiểm" },
  { value: "ACCIDENT", label: "Tai nạn / Sự cố" },
  { value: "TIRE_REPLACEMENT", label: "Thay lốp" },
  { value: "OTHER", label: "Khác" },
];

export const MAINTENANCE_STATUS_OPTIONS = [
  { value: "SCHEDULED", label: "Đã lên lịch" },
  { value: "IN_PROGRESS", label: "Đang thực hiện" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];
