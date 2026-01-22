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
  { value: "OPEN_FOR_BOOKING ", label: "Đang mở bán" },
  { value: "CLOSED_FOR_BOOKING", label: "Đã ngừng bán" },
  { value: "DEPARTED", label: "Đã xuất bến" },
  { value: "IN_PROGRESS", label: "Đang chạy" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];
