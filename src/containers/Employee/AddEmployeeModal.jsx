import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import { VietBusTheme } from "../../constants/VietBusTheme.js";
import { createEmployee } from "../../services/EmployeeService.jsx";

const AddEmployeeModal = ({open, onClose, onSuccess}) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const payload = {
                lastName: form.getFieldValue("lastName"),
                firstName: form.getFieldValue("firstName"),
                phoneNumber: form.getFieldValue("phoneNumber"),
                position: form.getFieldValue("position"),
            };
            const res = await createEmployee(payload);
            if (res?.statusCode === 201) {
                message.success("Thêm nhân viên thành công");
                form.resetFields();
                onClose();
                onSuccess?.();
            }
        } catch (e) {
            message.error("Thêm nhân viên thất bại");
        }
    };

    return (
        <Modal
            title="Thêm nhân viên"
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
                            rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Tên"
                            name="firstName"
                            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
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
                            rules={[{ required: true }]}
                        >
                            <Input maxLength={10} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Chức vụ"
                            name="position"
                            rules={[{ required: true }]}
                        >
                            <Select
                                options={[
                                    { value: "ADMIN", label: "Admin" },
                                    { value: "STAFF", label: "Nhân viên" },
                                    { value: "DRIVER", label: "Tài xế" },
                                    { value: "MANAGER", label: "Quản lý" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: VietBusTheme.primary,
                            color: VietBusTheme.white,
                        }}
                        onClick={handleSubmit}
                    >
                        Lưu
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddEmployeeModal;
