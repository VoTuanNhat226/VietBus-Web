import {Button, Col, Form, Input, message, Modal, Row, Select, Spin} from "antd";
import {ACTIVE_OPTIONS} from "../../../constants/Constants.js";
import {VietBusTheme} from "../../../constants/VietBusTheme";
import {createRoute} from "../../../services/RouteService";
import {getApiErrorMessage} from "../../../utils/Utils";
import {useState} from "react";

const AddRouteModal = ({listStation, open, onClose, onSuccess}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();
            const payload = {
                fromStationId: values.fromStationId,
                toStationId: values.toStationId,
                distanceKm: values.distanceKm,
                active: values.active,
            };
            await createRoute(payload);
            message.success("Tạo tuyến xe thành công");
            form.resetFields();
            onClose();
            onSuccess();
        } catch (err) {
            message.error(getApiErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="TẠO TUYẾN XE"
            open={open}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={null}
            width={700}
        >
            <Spin spinning={isLoading}>
                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Điểm đi"
                                name="fromStationId"
                                rules={[{required: true, message: "Bắt buộc"}]}
                            >
                                <Select
                                    placeholder="Chọn điểm đi"
                                    options={listStation?.map((station) => ({
                                        label: station.name, value: station.stationId,
                                    }))}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Điểm đến"
                                name="toStationId"
                                rules={[{required: true, message: "Bắt buộc"}]}
                            >
                                <Select
                                    placeholder="Chọn điểm đến"
                                    options={listStation?.map((station) => ({
                                        label: station.name, value: station.stationId,
                                    }))}
                                ></Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Khoảng cách (km)"
                                name="distanceKm"
                                rules={[{required: true, message: "Bắt buộc"}]}
                            >
                                <Input placeholder="Nhập khoảng cách"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Trạng thái"
                                name="active"
                                rules={[{required: true, message: "Bắt buộc"}]}
                            >
                                <Select placeholder="Chọn trạng thái" options={ACTIVE_OPTIONS}/>
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
                            style={{
                                backgroundColor: VietBusTheme.primary, color: VietBusTheme.white,
                            }}
                            onClick={handleSubmit}
                        >
                            Tạo
                        </Button>
                    </div>
                </Form>
            </Spin>
        </Modal>);
};

export default AddRouteModal;
