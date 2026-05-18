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
import {
  UserAddOutlined,
  CloseOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
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
        <div className="flex items-center gap-2 pb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ backgroundColor: `${VietBusTheme.primary}20` }}
          >
            <UserAddOutlined
              style={{ color: VietBusTheme.primary, fontSize: "16px" }}
            />
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-wide uppercase">
            THÊM NHÂN VIÊN
          </span>
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
      centered
      className="rounded-xl overflow-hidden"
      closeIcon={
        <div className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors flex items-center justify-center">
          <CloseOutlined className="text-gray-500 text-sm" />
        </div>
      }
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
                  label={<span className="font-medium text-gray-600">Họ và tên</span>}
                  name="fullName"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Input size="large" placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Số điện thoại</span>}
                  name="phoneNumber"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Input size="large" maxLength={10} placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Chức vụ</span>}
                  name="position"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select size="large" options={ROLE_OPTIONS} placeholder="Chọn chức vụ" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Trạng thái</span>}
                  name="active"
                  rules={[{ required: true, message: "Bắt buộc" }]}
                >
                  <Select
                    size="large"
                    options={ACTIVE_OPTIONS}
                    placeholder="Chọn trạng thái"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span className="font-medium text-gray-600">Tài khoản</span>}
                  name="account"
                >
                  <Select size="large" options={listAccount} placeholder="Chọn tài khoản" />
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
                setListAccount([]);
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
              Thêm
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddEmployeeModal;
