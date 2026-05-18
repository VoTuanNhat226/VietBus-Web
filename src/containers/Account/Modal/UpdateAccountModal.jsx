import { Button, Col, Form, message, Modal, Row, Select, Spin } from "antd";
import { CloseOutlined, EditOutlined, SettingOutlined } from "@ant-design/icons";
import { ACTIVE_OPTIONS } from "../../../constants/Constants.js";
import { VietBusTheme } from "../../../constants/VietBusTheme";
import { useEffect, useState } from "react";
import { updateAccount } from "../../../services/AccountService.js";

const UpdateAccountModal = ({ account, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (account && open) {
      form.setFieldsValue({
        active: account?.active,
      });
    }
  }, [account, open]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      if (values.active === account?.active) {
        message.warning("Không có thay đổi nào để cập nhật");
        setIsLoading(false);
        return;
      }

      const payload = {
        accountId: account?.accountId,
        active: values.active,
      };
      await updateAccount(payload);
      message.success("Cập nhật thành công");
      onSuccess();
      onClose();
    } catch (err) {
      message.error("Cập nhật thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 pb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ backgroundColor: `${VietBusTheme.primary}20` }}
          >
            <EditOutlined
              style={{ color: VietBusTheme.primary, fontSize: "16px" }}
            />
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-wide uppercase">
            CẬP NHẬT TÀI KHOẢN
          </span>
        </div>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={700}
      centered
      className="rounded-xl overflow-hidden"
      closeIcon={
        <div className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors flex items-center justify-center">
          <CloseOutlined className="text-gray-500 text-sm" />
        </div>
      }
      destroyOnClose
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" form={form}>
          <div className="mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2 text-base">
              <SettingOutlined /> Thông tin trạng thái
            </h3>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Trạng thái</span>}
                  name="active"
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                >
                  <Select options={ACTIVE_OPTIONS} size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex justify-end gap-3 pb-2">
            <Button
              size="large"
              className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
              onClick={() => {
                form.resetFields();
                onClose();
              }}
            >
              Hủy Bỏ
            </Button>
            <Button
              type="primary"
              size="large"
              className="px-8 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              style={{
                backgroundColor: VietBusTheme.primary,
                borderColor: VietBusTheme.primary,
                color: VietBusTheme.white,
              }}
              onClick={handleSubmit}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UpdateAccountModal;
