import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import { VietBusTheme } from "../../../constants/VietBusTheme.js";
import { updateEmployee } from "../../../services/EmployeeService.js";
import { useEffect } from "react";
import { getApiErrorMessage } from "../../../utils/Utils.js";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../../constants/Constants.js";

const UpdateEmployeeModal = ({ employee, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (employee && open) {
      form.setFieldsValue({
        lastName: employee?.lastName,
        firstName: employee?.firstName,
        phoneNumber: employee?.phoneNumber,
        position: employee?.position,
        active: employee?.active,
      });
    }
  }, [employee, open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        employeeId: employee.employeeId,
        lastName: values.lastName,
        firstName: values.firstName,
        phoneNumber: values.phoneNumber,
        position: values.position,
        active: values.active,
      };

      await updateEmployee(payload);
      message.success("Cập nhật thành công");
      onSuccess?.();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    }
  };

  return (
    <Modal
      title="CẬP NHẬT NHÂN VIÊN"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
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
        </Row>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Đóng</Button>
          <Button
            type="primary"
            style={{
              backgroundColor: VietBusTheme.primary,
              color: VietBusTheme.white,
            }}
            onClick={handleSubmit}
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateEmployeeModal;
