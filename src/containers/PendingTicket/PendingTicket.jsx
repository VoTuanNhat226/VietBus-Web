import {useEffect, useMemo, useState} from "react";
import {useAuth} from "../../context/AuthContext";
import {usePageTitle} from "../../context/PageTitleContext";
import {getAllTicketsUnpaid} from "../../services/TicketService";
import {Button, Card, Col, Form, Input, Row, Select, Table} from "antd";
import {
    PAYMENT_TYPE_OPTION,
    TICKET_STATUS_OPTION,
} from "../../constants/Constants";
import {VietBusTheme} from "../../constants/VietBusTheme";
import UpdatePendingTicketModal from "./Modal/UpdatePendingTicketModal";

const PendingTicket = () => {
    const {user} = useAuth();
    const {setTitle} = usePageTitle();
    const [formInstance] = Form.useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const [listPendingTicket, setListPendingTicket] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        setTitle("VÉ CHƯA THANH TOÁN");
    }, [setTitle]);

    const fetchPendingTicket = async (payload = {}) => {
        try {
            setIsLoading(true);
            const res = await getAllTicketsUnpaid(payload);
            setListPendingTicket(res?.data || []);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTicket();
    }, []);

    const handleSearch = async () => {
        const payload = formInstance.getFieldsValue();
        fetchPendingTicket(payload);
    };

    const ticketStatusMap = useMemo(() => {
        return Object.fromEntries(
            TICKET_STATUS_OPTION.map(item => [item.value, item.label])
        );
    }, []);

    const paymentTypeMap = useMemo(() => {
        return Object.fromEntries(
            PAYMENT_TYPE_OPTION.map(item => [item.value, item.label])
        );
    }, []);

    const columns = useMemo(() => [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (_text, _record, index) => index + 1,
        },
        {
            title: "Mã vé",
            dataIndex: "ticketCode",
            key: "ticketCode",
        },
        {
            title: "Mã chuyến",
            dataIndex: "tripCode",
            key: "tripCode",
        },
        {
            title: "Giá vé",
            dataIndex: "ticketPrice",
            key: "ticketPrice",
            render: (price) => `${new Intl.NumberFormat("vi-VN").format(price)} VNĐ`,
        },
        {
            title: "Trạng thái vé",
            dataIndex: "ticketStatus",
            key: "ticketStatus",
            render: (status) => ticketStatusMap[status] || status
        },
        {
            title: "Hình thức thanh toán",
            dataIndex: "ticketPaymentType",
            key: "ticketPaymentType",
            render: (status) => paymentTypeMap[status] || status
        },
        {
            title: "Số ghế",
            dataIndex: "seatNumber",
            key: "seatNumber",
        },
        {
            title: "Điểm đi",
            dataIndex: "fromStation",
            key: "fromStation",
        },
        {
            title: "Điểm đến",
            dataIndex: "toStation",
            key: "toStation",
        },
        {
            title: "Người bán",
            dataIndex: "ticketSoldBy",
            key: "ticketSoldBy",
        },
        {
            title: "Cập nhật",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div className="flex justify-evenly">
                    <i
                        className="fa-regular fa-pen-to-square"
                        style={{
                            color: VietBusTheme.primary,
                            fontSize: 18,
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            setSelectedTicket(record);
                            setOpenUpdateModal(true);
                        }}
                    />
                </div>
            ),
        },
    ], [paymentTypeMap, ticketStatusMap]);

    return (
        <>
            <Card>
                <h2>Search area</h2>
                <Form form={formInstance}>
                    <Row gutter={[16, 0]}>
                        <Col span={6}>
                            <Form.Item name="ticketCode">
                                <Input placeholder="Mã vé"/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="tripCode">
                                <Input placeholder="Mã chuyến"/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="ticketPaymentType">
                                <Select
                                    placeholder="Hình thức thanh toán"
                                    options={PAYMENT_TYPE_OPTION}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="ticketSoldBy">
                                <Input placeholder="Người bán"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" gutter={8}>
                        <Col>
                            <Button
                                onClick={() => formInstance.resetFields()}
                            >
                                Reset
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                style={{
                                    backgroundColor: VietBusTheme.primary,
                                    color: VietBusTheme.white,
                                }}
                                onClick={handleSearch}
                            >
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Table
                className="pt-4"
                loading={isLoading}
                dataSource={listPendingTicket}
                columns={columns}
            />
            {/* UPDATE PendingTicket Modal */}
            {openUpdateModal && (
                <UpdatePendingTicketModal
                    open={openUpdateModal}
                    ticket={selectedTicket}
                    onClose={() => {
                        setOpenUpdateModal(false);
                        setSelectedTicket(null);
                    }}
                    onSuccess={() => fetchPendingTicket()}
                />
            )}
        </>
    );
};

export default PendingTicket;
