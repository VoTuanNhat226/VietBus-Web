import { Button, Card, Col, Form, Input, Modal, Row, Table, message } from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { useState } from "react";
import { deletePassenger } from "../../../services/PassengerService";

const DeletePassengerModal = ({
  onSuccess,
  onCancel,
  passenger,
  openDeleteModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!passenger) return;
    setIsLoading(true);
    try {
      await deletePassenger({ passengerId: passenger.passengerId });
      message.success("Xóa hành khách thành công");
      onSuccess();
    } catch (error) {
      console.error("Error occurred while deleting passenger:", error);
      message.error("Có lỗi xảy ra khi xóa hành khách. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <i
            className="fa-solid fa-triangle-exclamation pr-2"
            style={{
              color: VietBusTheme.error,
              fontSize: 14,
            }}
          />
          <span>Xóa hành khách</span>
        </div>
      }
      open={openDeleteModal}
      onOk={handleDelete}
      onCancel={onCancel}
      confirmLoading={isLoading}
      footer={
        <div className="flex justify-center">
          <Button className="mr-2" onClick={onCancel} disabled={isLoading}>
            Đóng
          </Button>
          <Button
            type="primary"
            className="ml-2"
            style={{
              backgroundColor: VietBusTheme.primary,
              color: VietBusTheme.white,
            }}
            onClick={handleDelete}
            loading={isLoading}
          >
            Xóa
          </Button>
        </div>
      }
    >
      <p>Bạn có chắc chắn muốn xóa hành khách <strong>{passenger?.fullName}</strong>?</p>
    </Modal>
  );
};

export default DeletePassengerModal;
