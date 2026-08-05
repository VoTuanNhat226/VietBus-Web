import moment from "moment";

export const getApiErrorMessage = (err) =>
  err?.response?.data?.description ||
  err?.response?.data?.message ||
  "Có lỗi xảy ra";

export const formatDateTime = (value) =>
  value ? moment(value).format("DD-MM-YYYY HH:mm") : "";

export const formatDate = (value) =>
  value ? moment(value).format("DD-MM-YYYY") : "";

export const formatVND = (value) => value.toLocaleString("vi-VN") + " VNĐ";
