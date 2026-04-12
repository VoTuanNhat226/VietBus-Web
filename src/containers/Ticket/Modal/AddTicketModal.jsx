import {
    Button,
    Col,
    Form,
    Input,
    message,
    Modal,
    Radio,
    Row,
    Select,
    Spin,
} from "antd";
import {useEffect, useState} from "react";
import {
    getListTripSeatAvailableByTripId,
} from "../../../services/TripSeatService";
import moment from "moment";
import {
    getAllTripOpenBooking,
} from "../../../services/TripService";
import TextArea from "antd/es/input/TextArea";
import {VietBusTheme} from "../../../constants/VietBusTheme";
import {getApiErrorMessage} from "../../../utils/Utils";
import {PAYMENT_METHOD_OPTION} from "../../../constants/Constants";
import {createTicket} from "../../../services/TicketService";

const AddTicketModal = ({open, onClose, onSuccess}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const [selectedTripId, setSelectedTripId] = useState(null);
    const [listTripCanSell, setListTripCanSell] = useState([]);
    const [listTripSeatCanSell, setListTripSeatCanSell] = useState([]);

    useEffect(() => {
        const fetchTripOpenBooking = async () => {
            const res = await getAllTripOpenBooking({});
            const options = (res?.data || []).map((item) => ({
                value: item.tripId,
                label: `${item.tripCode}
        | ${item.fromStation} - ${item.toStation}
        | ${moment(item.departureTime).format(
                    "HH:mm:ss DD-MM-YYYY"
                )} - ${moment(item.arrivalTime).format("HH:mm:ss DD-MM-YYYY")}`,
                price: item.price,
            }));
            setListTripCanSell(options);
        };
        fetchTripOpenBooking();
    }, []);

    useEffect(() => {
        if (!selectedTripId) return;
        setIsLoading(true);
        const fetchListTripSeatCanSell = async () => {
            const tripSeats = await getListTripSeatAvailableByTripId({
                tripId: selectedTripId,
            });
            const options = (tripSeats?.data || [])
                .sort((a, b) =>
                    a.seatNumber.localeCompare(b.seatNumber, undefined, {
                        numeric: true,
                        sensitivity: "base",
                    })
                )
                .map((item) => ({
                    value: item.tripSeatId,
                    label: `${item.seatNumber}`,
                }));
            setListTripSeatCanSell(options);
            setIsLoading(false);
        };
        fetchListTripSeatCanSell();
    }, [selectedTripId]);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();
            const payload = {
                tripId: values.tripId,
                passengerId: values.passengerId || null,
                tripSeatId: values.tripSeatId,
                ticketPrice: values.ticketPrice,
                paymentType: values.paymentType,
                paymentMethod: values.paymentMethod,
                note: values.note,
            };
            await createTicket(payload);
            message.success("Tạo vé thành công");
            form.resetFields();
            onClose();
            //   onSuccess();
        } catch (err) {
            message.error(getApiErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const paymentType = Form.useWatch("paymentType", form);
    useEffect(() => {
        if (paymentType !== "PAY_NOW") {
            form.setFieldValue("paymentMethod", undefined);
        }
    }, [paymentType]);

    return (
        <Modal
            title="TẠO VÉ"
            open={open}
            onCancel={() => {
                form.resetFields(), onClose();
            }}
            footer={null}
            width={750}
        >
            <Spin spinning={isLoading}>
                <Form layout="vertical" form={form} disabled={isLoading}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="tripId"
                                label="Chuyến xe"
                                rules={[{required: true, message: "Bắt buộc"}]}
                            >
                                <Select
                                    options={listTripCanSell}
                                    placeholder="Chọn chuyến xe"
                                    onChange={(value, option) => {
                                        setSelectedTripId(value);
                                        const formatVND = (value) =>
                                            value.toLocaleString("vi-VN") + " VNĐ";
                                        form.setFieldValue("tripPrice", formatVND(option.price));
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="passengerId" label="Khách hàng">
                                <Select options={[]} placeholder="Chọn khách hàng"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="tripSeatId"
                                label="Giường"
                                rules={[{required: true, message: "Bắt buộc"}]}
                            >
                                <Select
                                    options={listTripSeatCanSell}
                                    placeholder="Chọn giường"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="tripPrice" label="Giá niêm yết">
                                <Input readOnly/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="ticketPrice"
                                label="Giá vé"
                                rules={[{required: true, message: "Bắt buộc"}]}
                            >
                                <Input placeholder="Nhập giá vé"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="paymentMethod"
                                label="Phương thức thanh toán"
                                rules={[
                                    {required: paymentType === "PAY_NOW", message: "Bắt buộc"},
                                ]}
                            >
                                <Select
                                    options={PAYMENT_METHOD_OPTION}
                                    disabled={paymentType !== "PAY_NOW"}
                                    placeholder={
                                        paymentType === "PAY_NOW"
                                            ? "Chọn phương thức thanh toán"
                                            : "Chỉ áp dụng khi trả ngay"
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="paymentType"
                                label="Hình thức thanh toán"
                                rules={[{required: true, message: "Bắt buộc"}]}
                            >
                                <Radio.Group>
                                    <Radio value="PAY_NOW">Trả ngay</Radio>
                                    <Radio value="PAY_LATER">Trả sau</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="note" label="Ghi chú">
                                <TextArea
                                    rows={4}
                                    placeholder="Nhập ghi chú..."
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={() => {
                                form.resetFields(), onClose();
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
            </Spin>
        </Modal>
    );
};

export default AddTicketModal;
