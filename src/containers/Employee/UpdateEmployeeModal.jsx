import {Button, Col, Form, Input, Modal, Row, Select, message} from "antd";
import {VietBusTheme} from "../../constants/VietBusTheme.js";
import {updateEmployee} from "../../services/EmployeeService.jsx";
import {useEffect} from "react";

const UpdateEmployeeModal = ({employee, open, onClose, onSuccess}) => {
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
            const payload = {
                employeeId: employee.employeeId,
                lastName: form.getFieldValue('lastName'),
                firstName: form.getFieldValue('firstName'),
                phoneNumber: form.getFieldValue('phoneNumber'),
                position: form.getFieldValue('position'),
                active: form.getFieldValue('active'),
            };
            const res = await updateEmployee(payload);
            if (res?.statusCode === 200) {
                message.success("Cập nhật thành công");
                onSuccess?.();
            }
        } catch (e) {
            message.error("Cập nhật thất bại");
        }
    };

    return (
        <Modal
            title="Cập nhật nhân viên"
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
                            rules={[{required: true, message: "Vui lòng nhập họ"}]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Tên"
                            name="firstName"
                            rules={[{required: true, message: "Vui lòng nhập tên"}]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                            rules={[{required: true}]}
                        >
                            <Input maxLength={10}/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Chức vụ"
                            name="position"
                            rules={[{required: true}]}
                        >
                            <Select
                                options={[
                                    {value: "ADMIN", label: "Admin"},
                                    {value: "STAFF", label: "Nhân viên"},
                                    {value: "DRIVER", label: "Tài xế"},
                                    {value: "MANAGER", label: "Quản lý"},
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Trạng thái"
                            name="active"
                            rules={[{required: true}]}
                        >
                            <Select
                                options={[
                                    {value: true, label: "Hoạt động"},
                                    {value: false, label: "Không hoạt động"},
                                ]}
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
        </Modal>
    );
};

export default UpdateEmployeeModal;
