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
import { CloseOutlined, EditOutlined, IdcardOutlined } from "@ant-design/icons";
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
            CẬP NHẬT NHÂN VIÊN
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
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
              <IdcardOutlined /> Thông tin nhân viên
            </h3>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">Họ và tên</span>
                  }
                  name="fullName"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Input size="large" disabled={true} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Số điện thoại
                    </span>
                  }
                  name="phoneNumber"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Input size="large" maxLength={10} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">Chức vụ</span>
                  }
                  name="position"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select size="large" disabled={true} options={ROLE_OPTIONS} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Trạng thái
                    </span>
                  }
                  name="active"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select size="large" options={ACTIVE_OPTIONS} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-medium text-gray-600">Tài khoản</span>
                  }
                  name="accountId"
                >
                  <Select
                    size="large"
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
          </div>

          <div className="flex justify-end gap-3 pb-2">
            <Button
              size="large"
              className="px-6 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-gray-300"
              onClick={onClose}
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

export default UpdateEmployeeModal;
