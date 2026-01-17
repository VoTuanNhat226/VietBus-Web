import React from "react";
import {Form, Input, Button, Card, Typography, message} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

const {Title} = Typography;

const Login = () => {
    const {login, loading} = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const success = await login(values.username, values.password);

        if (success) {
            navigate("/");
        } else {
            message.error("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
            <Card style={{width: 360}}>
                <Title level={3} className="text-center">
                    Đăng nhập
                </Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{required: true, message: "Bắt buộc"}]}
                    >
                        <Input prefix={<UserOutlined/>}/>
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{required: true, message: "Bắt buộc"}]}
                    >
                        <Input.Password prefix={<LockOutlined/>}/>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng nhập
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
