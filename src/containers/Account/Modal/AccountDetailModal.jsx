import { Modal } from "antd";
import { useEffect } from "react";

const AccountDetailModal = ({ open, onClose, user }) => {
  useEffect(() => {
    console.log("user: ", user);
  }, []);
  return (
    <Modal
      title="THÔNG TIN TÀI KHOẢN"
      open={open}
      onCancel={() => {
        onClose();
      }}
      footer={null}
      width={700}
    ></Modal>
  );
};

export default AccountDetailModal;
