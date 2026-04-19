import React from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  ConfigProvider,
  Card,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { VietBusTheme } from "../constants/VietBusTheme";

const { Title, Text } = Typography;

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const success = await login(values.username, values.password);

    if (success) {
      message.success("Đăng nhập thành công!");
      navigate("/");
    } else {
      message.error("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: VietBusTheme.primary,
          borderRadius: 12,
          colorBgContainer: "#ffffff",
        },
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4">
        <div className="w-full max-w-[760px]">
          <Card
            bordered={false}
            className="shadow-2xl overflow-hidden rounded-3xl"
            styles={{ body: { padding: 0 } }}
          >
            <div className="flex flex-col md:flex-row min-h-[450px]">
              {/* Left Side: Branding */}
              <div
                className="w-full md:w-5/12 p-8 flex flex-col items-center justify-center text-white text-center"
                style={{ backgroundColor: VietBusTheme.primary }}
              >
                <div className="mb-4 bg-white/20 p-4 rounded-2xl backdrop-blur-sm shadow-inner">
                  <i className="fa-solid fa-bus text-4xl"></i>
                </div>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "white",
                    fontWeight: 800,
                    letterSpacing: "1px",
                  }}
                >
                  VietBus
                </Title>
                <div className="h-1 w-10 bg-white/40 my-3 rounded-full"></div>
                <Text className="text-white/90 text-base font-light leading-relaxed">
                  Quản lý vận tải thông minh
                </Text>
              </div>

              {/* Right Side: Login Form */}
              <div className="w-full md:w-7/12 p-8 md:p-10 bg-white">
                <Form
                  layout="vertical"
                  onFinish={onFinish}
                  size="large"
                  requiredMark={false}
                >
                  <Form.Item
                    label={
                      <span className="text-gray-500 font-semibold uppercase text-[14px] tracking-wider">
                        Tên đăng nhập
                      </span>
                    }
                    name="username"
                    rules={[
                      { required: true, message: "Vui lòng nhập tài khoản" },
                    ]}
                    className="mb-4"
                  >
                    <Input
                      prefix={<UserOutlined className="text-gray-300" />}
                      placeholder="Tên đăng nhập"
                      className="rounded-lg border-gray-200"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-gray-500 font-semibold uppercase text-[14px] tracking-wider">
                        Mật khẩu
                      </span>
                    }
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu" },
                    ]}
                    className="mb-6"
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-300" />}
                      placeholder="••••••••"
                      className="rounded-lg border-gray-200"
                    />
                  </Form.Item>

                  <div>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      className="h-12 text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20"
                      style={{ backgroundColor: VietBusTheme.primary }}
                    >
                      ĐĂNG NHẬP
                    </Button>
                  </div>
                </Form>

                <div className="mt-10 text-center text-gray-600 text-[12px] uppercase tracking-widest font-medium">
                  © 2026 VietBus Management System
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Login;
