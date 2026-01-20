export const getApiErrorMessage = (err) =>
  err?.response?.data?.description ||
  err?.response?.data?.message ||
  "Có lỗi xảy ra";
