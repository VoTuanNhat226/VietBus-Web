import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
  Spin,
} from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme.js";
import { createEmployee } from "../../../services/EmployeeService.js";
import { getApiErrorMessage } from "../../../utils/Utils.js";
import { useEffect, useState } from "react";
import { getAllAccountByRole } from "../../../services/AccountService.js";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../../constants/Constants.js";

const AddEmployeeModal = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [listAccount, setListAccount] = useState([]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const payload = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        position: values.position,
        active: values.active,
        accountId: values.account,
      };

      await createEmployee(payload);
      message.success("Thêm nhân viên thành công");
      form.resetFields();
      onClose();
      onSuccess();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const position = Form.useWatch("position", form);
  useEffect(() => {
    if (!position) return;
    const fetchAccount = async () => {
      try {
        setIsLoading(true);
        const res = await getAllAccountByRole({ role: position });
        const options = (res?.data || []).map((acc) => ({
          label: `${acc.username} - ${acc.role}`,
          value: acc.accountId,
        }));
        setListAccount(options);
      } catch (error) {
        setListAccount([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
  }, [position]);

  return (
    <Modal
      title={
        <div style={{ color: VietBusTheme.primary, fontSize: "20px" }}>
          THÊM NHÂN VIÊN
        </div>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        setListAccount([]);
        onClose();
      }}
      footer={null}
      width={700}
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Input maxLength={10} placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Chức vụ"
                name="position"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Select options={ROLE_OPTIONS} placeholder="Chọn chức vụ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="active"
                rules={[{ required: true, message: "Bắt buộc" }]}
              >
                <Select
                  options={ACTIVE_OPTIONS}
                  placeholder="Chọn trạng thái"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tài khoản" name="account">
                <Select options={listAccount} placeholder="Chọn tài khoản" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                (form.resetFields(), setListAccount([]), onClose());
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: VietBusTheme.primary,
                color: VietBusTheme.white,
              }}
              onClick={handleSubmit}
            >
              Thêm
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddEmployeeModal;
