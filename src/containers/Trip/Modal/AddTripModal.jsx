import {
    Button,
    Col,
    DatePicker,
    Form,
    Input, InputNumber,
    message,
    Modal,
    Row,
    Select,
} from "antd";
import {VietBusTheme} from "../../../constants/VietBusTheme";
import {useEffect, useState} from "react";
import {getAllRouteActive} from "../../../services/RouteService";
import {getAllEmployeeByPosition} from "../../../services/EmployeeService";
import {getAllVehicleActive} from "../../../services/VehicleService";
import {getApiErrorMessage} from "../../../utils/Utils";
import {createTrip} from "../../../services/TripService";
import dayjs from "dayjs";
import {ROLE} from "../../../constants/Constants.js";

const AddTripModal = ({open, onClose, onSuccess}) => {
    const [form] = Form.useForm();

    const [listRouteActive, setListRouteActive] = useState([]);
    const [listDriverActive, setListDriverActive] = useState([]);
    const [listAssistantActive, setListAssistantActive] = useState([]);
    const [listVehicleActive, setListVehicleActive] = useState([]);

    useEffect(() => {
        const fetchListRouteActive = async () => {
            const res = await getAllRouteActive({});
            setListRouteActive(res?.data);
        };
        const fetchListDriverActive = async () => {
            const payload = {
                position: ROLE.DRIVER,
            };
            const res = await getAllEmployeeByPosition(payload);
            setListDriverActive(res?.data);
        };
        const fetchListAssistantActive = async () => {
            const payload = {
                position: ROLE.ASSISTANT,
            };
            const res = await getAllEmployeeByPosition(payload);
            setListAssistantActive(res?.data);
        };
        const fetchListVehicleActive = async () => {
            const res = await getAllVehicleActive({});
            setListVehicleActive(res?.data);
        };
        fetchListRouteActive();
        fetchListDriverActive();
        fetchListAssistantActive()
        fetchListVehicleActive();
    }, []);

    const handleSubmit = async () => {
        try {
            const departureTime = form.getFieldValue("departureTime");
            const arrivalTime = form.getFieldValue("arrivalTime");

            const payload = {
                routeId: form.getFieldValue("routeId"),
                driverIds: form.getFieldValue("driverIds"),
                assistantIds: form.getFieldValue("assistantIds"),
                vehicleId: form.getFieldValue("vehicleId"),
                departureTime: departureTime
                    ? departureTime.format("YYYY-MM-DDTHH:mm:ss")
                    : null,
                arrivalTime: arrivalTime
                    ? arrivalTime.format("YYYY-MM-DDTHH:mm:ss")
                    : null,
                price: form.getFieldValue("price"),
            };
            await createTrip(payload);
            message.success("Tạo chuyến xe thành công");
            form.resetFields();
            onClose();
            onSuccess();
        } catch (err) {
            message.error(getApiErrorMessage(err));
        }
    };

    return (
        <Modal
            title="TẠO CHUYẾN XE"
            open={open}
            onCancel={() => {
                form.resetFields(), onClose();
            }}
            footer={null}
            width={700}
        >
            <Form layout="vertical" form={form}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Tuyến xe"
                            name="routeId"
                            rules={[{required: true, message: "Bắt buộc"}]}
                        >
                            <Select
                                placeholder="Chọn tuyến xe"
                                options={listRouteActive?.map((route) => ({
                                    label: route.fromStation.name + " - " + route.toStation.name,
                                    value: route.routeId,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Tài xế"
                            name="driverIds"
                            rules={[{required: true, message: "Bắt buộc"}]}
                        >
                            <Select
                                placeholder="Chọn tài xế"
                                options={listDriverActive?.map((driver) => ({
                                    label: driver.fullName,
                                    value: driver.employeeId,
                                }))}
                                mode="multiple"
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Phụ xe"
                            name="assistantIds"
                            rules={[{required: true, message: "Bắt buộc"}]}
                        >
                            <Select
                                placeholder="Chọn phụ xe"
                                options={listAssistantActive?.map((assistant) => ({
                                    label: assistant.fullName,
                                    value: assistant.employeeId,
                                }))}
                                mode="multiple"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Xe"
                            name="vehicleId"
                            rules={[{required: true, message: "Bắt buộc"}]}
                        >
                            <Select
                                placeholder="Chọn xe"
                                options={listVehicleActive?.map((vehicle) => ({
                                    label: vehicle.licensePlate,
                                    value: vehicle.vehicleId,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giá niêm yết"
                            name="price"
                            rules={[{required: true, message: "Bắt buộc"}]}
                        >
                            <Input placeholder="Nhập giá niêm yết"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Thời gian xuất bến"
                            name="departureTime"
                            rules={[{required: true, message: "Bắt buộc"}]}
                        >
                            <DatePicker
                                className="w-full"
                                showTime={{format: "HH:mm"}}
                                format="YYYY-MM-DD HH:mm"
                                disabledDate={(current) =>
                                    current && current < dayjs().startOf("day")
                                }
                                placeholder="Chọn thời gian"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Thời gian đến (dự kiến)"
                            name="arrivalTime"
                            dependencies={["departureTime"]}
                            disabled={!form.getFieldValue("departureTime")}
                            rules={[
                                {required: true, message: "Bắt buộc"},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        const departureTime = getFieldValue("departureTime");

                                        if (!value || !departureTime) return Promise.resolve();

                                        if (value.isBefore(departureTime)) {
                                            return Promise.reject(
                                                new Error("Thời gian đến phải sau thời gian xuất bến")
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                className="w-full"
                                showTime={{format: "HH:mm"}}
                                format="YYYY-MM-DD HH:mm"
                                disabledDate={(current) => {
                                    const departureTime = form.getFieldValue("departureTime");
                                    if (!departureTime) return false;

                                    // Chặn ngày trước ngày xuất bến
                                    return current && current < departureTime.startOf("day");
                                }}
                                disabledTime={(current) => {
                                    const departureTime = form.getFieldValue("departureTime");
                                    if (!departureTime || !current) return {};

                                    // Nếu cùng ngày xuất bến → chặn giờ/phút trước đó
                                    if (current.isSame(departureTime, "day")) {
                                        return {
                                            disabledHours: () =>
                                                Array.from(
                                                    {length: departureTime.hour()},
                                                    (_, i) => i
                                                ),
                                            disabledMinutes: (selectedHour) =>
                                                selectedHour === departureTime.hour()
                                                    ? Array.from(
                                                        {length: departureTime.minute()},
                                                        (_, i) => i
                                                    )
                                                    : [],
                                        };
                                    }

                                    return {};
                                }}
                                placeholder="Chọn thời gian"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={() => {
                            form.resetFields();
                            onClose();
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
                        Tạo
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddTripModal;
