import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Select,
    Table,
} from "antd";
import {VietBusTheme} from "../../constants/VietBusTheme.js";
import {useEffect, useState} from "react";
import {getAllEmployee} from "../../services/EmployeeService.jsx";
import moment from "moment";
import {useAuth} from "../../context/AuthContext.jsx";
import AddEmployeeModal from "./AddEmployeeModal.jsx";
import UpdateEmployeeModal from "./UpdateEmployeeModal.jsx";

const EmployeeManagement = () => {
    const [formIntance] = Form.useForm();
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [listEmployee, setListEmployee] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const {user} = useAuth();

    useEffect(() => {
        const fetchAllEmployee = async () => {
            const res = await getAllEmployee({});
            setListEmployee(res?.data);
        };
        fetchAllEmployee();
    }, []);

    const handleSearch = async () => {
        const payload = {
            firstName: formIntance.getFieldValue("firstName"),
            lastName: formIntance.getFieldValue("lastName"),
            phoneNumber: formIntance.getFieldValue("phoneNumber"),
            position: formIntance.getFieldValue("position"),
        };
        const res = await getAllEmployee(payload);
        setListEmployee(res?.data);
    };

    const handlAddEmployee = () => {
        setOpenAddModal(true);
    };

    const handleEditEmployee = (employee) => {
        setSelectedEmployee(employee);
        setOpenUpdateModal(true);
    }

    const columns = [
        {
            title: "Họ và tên lót",
            dataIndex: "lastName",
            key: "lastName",
        },
        {
            title: "Tên",
            dataIndex: "firstName",
            key: "firstName",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Chức vụ",
            dataIndex: "position",
            key: "position",
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            key: "active",
            render: (value) => (value === true ? "Hoạt động" : "Không hoạt động"),
        },
        {
            title: "Người tạo",
            dataIndex: "created_by",
            key: "created_by",
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            key: "createdAt",
            render: (value) =>
                value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
        },
        {
            title: "Người cập nhật",
            dataIndex: "updated_by",
            key: "updatedBy",
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updated_at",
            key: "updatedAt",
            render: (value) =>
                value ? moment(value).format("HH:mm:ss DD-MM-YYYY") : "",
        },
        {
            title: "Hành động",
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
                        onClick={() => handleEditEmployee(record)}
                    />
                    <i className="fa-regular fa-trash-can" style={{
                        color: VietBusTheme.error,
                        fontSize: 18,
                        cursor: "pointer",
                    }}/>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Card>
                <h2>Search area</h2>
                <Form form={formIntance}>
                    <Row gutter={[16, 0]}>
                        <Col span={6}>
                            <Form.Item name="lastName">
                                <Input placeholder="Họ và tên lót"/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="firstName">
                                <Input placeholder="Tên"/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="phoneNumber">
                                <Input
                                    maxLength={10}
                                    placeholder="Số điện thoại"
                                    inputMode="numeric"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="position">
                                <Select
                                    placeholder="Chọn chức vụ"
                                    options={[
                                        {value: "ADMIN", label: "Admin"},
                                        {value: "STAFF", label: "Nhân viên"},
                                        {value: "DRIVER", label: "Tài xế"},
                                        {value: "MANAGER", label: "Quản lý"},
                                    ]}
                                ></Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" gutter={8}>
                        <Col>
                            <Button
                                htmlType="reset"
                                onClick={() => formIntance.resetFields()}
                            >
                                Reset
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                htmlType="submit"
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
            {user?.role === "ROLE_ADMIN" ?
                <div className="pt-4 flex justify-end">
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: VietBusTheme.primary,
                            color: VietBusTheme.white,
                        }}
                        onClick={handlAddEmployee}
                    >
                        Thêm nhân viên
                    </Button>
                </div>
                : null}
            <Table className="pt-4" dataSource={listEmployee} columns={columns}/>
            <AddEmployeeModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                onSuccess={async () => {
                    const res = await getAllEmployee({});
                    setListEmployee(res?.data);
                }}
            />
            <UpdateEmployeeModal
                open={openUpdateModal}
                employee={selectedEmployee}
                onClose={() => {
                    setOpenUpdateModal(false);
                    setSelectedEmployee(null);
                }}
                onSuccess={async () => {
                    const res = await getAllEmployee({});
                    setListEmployee(res?.data);
                }}
            />
        </div>
    );
};

export default EmployeeManagement;
