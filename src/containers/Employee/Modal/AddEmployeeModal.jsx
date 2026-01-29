import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme.js";
import { createEmployee } from "../../../services/EmployeeService.js";
import { getApiErrorMessage } from "../../../utils/Utils.js";
import { useEffect, useState } from "react";
import { getAllAccountByRole } from "../../../services/AccountService.js";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../../constants/Constants.js";

const AddEmployeeModal = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [listAccount, setListAccount] = useState([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        lastName: values.lastName,
        firstName: values.firstName,
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
    }
  };

  const position = Form.useWatch("position", form);
  useEffect(() => {
    if (!position) return;

    const fetchAccount = async () => {
      try {
        const res = await getAllAccountByRole({ role: position });

        const options = (res?.data || []).map((acc) => ({
          label: `${acc.username} - ${acc.role}`,
          value: acc.accountId,
        }));

        setListAccount(options);
      } catch (error) {
        setListAccount([]);
      }
    };

    fetchAccount();
  }, [position]);

  return (
    <Modal
      title="THÊM NHÂN VIÊN"
      open={open}
      onCancel={() => {
        form.resetFields(), setListAccount([]), onClose();
      }}
      footer={null}
      width={700}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Họ và tên lót"
              name="lastName"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Tên"
              name="firstName"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Input />
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
              <Input maxLength={10} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Chức vụ"
              name="position"
              rules={[{ required: true, message: "Bắt buộc" }]}
            >
              <Select options={ROLE_OPTIONS} />
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
              <Select options={ACTIVE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tài khoản" name="account">
              <Select options={listAccount} />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              form.resetFields(), setListAccount([]), onClose();
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
    </Modal>
  );
};

export default AddEmployeeModal;
