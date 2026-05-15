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
import { updateEmployee } from "../../../services/EmployeeService.js";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../../utils/Utils.js";
import { ACTIVE_OPTIONS, ROLE_OPTIONS } from "../../../constants/Constants.js";
import { getAllAccountByRole } from "../../../services/AccountService.js";

const UpdateEmployeeModal = ({ employee, open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [listAccount, setListAccount] = useState([]);

  useEffect(() => {
    if (employee && open) {
      form.setFieldsValue({
        fullName: employee?.fullName,
        phoneNumber: employee?.phoneNumber,
        position: employee?.position,
        active: employee?.active,
        accountId: employee?.account?.accountId,
      });
    }
  }, [employee, open]);

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

        if (
          employee?.account?.accountId &&
          !options.find((opt) => opt.value === employee.account.accountId)
        ) {
          options.unshift({
            label: `${employee.account.username}`,
            value: employee.account.accountId,
          });
        }

        setListAccount(options);
      } catch (error) {
        setListAccount([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
  }, [position, employee]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      // Check if there are any changes
      const isChanged =
        values.fullName !== employee?.fullName ||
        values.phoneNumber !== employee?.phoneNumber ||
        values.position !== employee?.position ||
        values.active !== employee?.active ||
        values.accountId !== employee?.account?.accountId;

      if (!isChanged) {
        message.warning("Không có thay đổi nào để cập nhật");
        setIsLoading(false);
        return;
      }

      const payload = {
        employeeId: employee.employeeId,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        position: values.position,
        active: values.active,
        accountId: values.accountId,
      };
      await updateEmployee(payload);
      message.success("Cập nhật thành công");
      onSuccess();
      onClose();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ color: VietBusTheme.primary, fontSize: "20px" }}>
          CẬP NHẬT NHÂN VIÊN
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
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
                <Input disabled={true} />
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
                <Select disabled={true} options={ROLE_OPTIONS} />
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
              <Form.Item label="Tài khoản" name="accountId">
                <Select
                  disabled={!!employee?.account?.accountId}
                  options={listAccount}
                  placeholder="Chọn tài khoản"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
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
      </Spin>
    </Modal>
  );
};

export default UpdateEmployeeModal;
