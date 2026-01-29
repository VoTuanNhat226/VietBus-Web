export const ROLE_OPTIONS = [
  { value: "ADMIN", label: "ADMIN" },
  { value: "STAFF", label: "STAFF" },
  { value: "DRIVER", label: "DRIVER" },
  { value: "MANAGER", label: "MANAGER" },
];

export const ACTIVE_OPTIONS = [
  { value: true, label: "Hoạt động" },
  { value: false, label: "Không hoạt động" },
];

export const STATUS_TRIP_OPTIONS = [
  { value: "CREATED", label: "Mới tạo" },
  { value: "SCHEDULED", label: "Đã lên lịch" },
  { value: "OPEN_FOR_BOOKING", label: "Đang mở bán" },
  { value: "CLOSED_FOR_BOOKING", label: "Đã ngừng bán" },
  { value: "DEPARTED", label: "Đã xuất bến" },
  { value: "IN_PROGRESS", label: "Đang chạy" },
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
