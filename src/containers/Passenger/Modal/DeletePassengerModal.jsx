import { Button, Card, Col, Form, Input, Modal, Row, Table } from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme";

const DeletePassengerModal = ({
  onConfirm,
  onCancel,
  passenger,
  openDeleteModal,
}) => {
  console.log("Passenger to delete:", passenger);
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
      onOk={onConfirm}
      onCancel={onCancel}
      footer={
        <div className="flex justify-center">
          <Button className="mr-2" onClick={onCancel}>
            Đóng
          </Button>
          <Button
            type="primary"
            className="ml-2"
            style={{
              backgroundColor: VietBusTheme.primary,
              color: VietBusTheme.white,
            }}
            onClick={onConfirm}
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
