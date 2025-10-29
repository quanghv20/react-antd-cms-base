import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services";
import { appMessage } from "@/utils/message";
import { encryptWithPublicKey } from "@/utils/rsaEncrypt.util";
import { SERVER_PUBLIC_KEY_BASE64, STORAGE_KEYS } from "@/constants";
import { useAppLoading } from "@/context/LoadingContext";
import Logo from "@/layouts/Logo";

import "./LoginPage.css";
import { useEffect, useRef } from "react";

export default function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { openAppLoading, closeAppLoading } = useAppLoading();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      openAppLoading();

      // 🔐 Mã hoá password
      const passwordEncrypted = encryptWithPublicKey(
        SERVER_PUBLIC_KEY_BASE64,
        values.password
      );
      if (!passwordEncrypted) {
        appMessage.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        return;
      }

      // payload login
      const payload = {
        username: values.username,
        password: passwordEncrypted,
      };

      // login
      const res = await authService.login(payload);

      if (res?.accessToken?.token) {
        // ✅ Sau khi login thành công → lấy thông tin user
        const user = await authService.getUserDetail();

        // Lưu tokens
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.accessToken.token);
        localStorage.setItem(
          STORAGE_KEYS.REFRESH_TOKEN,
          res.refreshToken.token
        );

        // Lưu user detail (stringify trước khi lưu)
        localStorage.setItem(STORAGE_KEYS.USER_LOGGED, JSON.stringify(user));

        appMessage.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (err) {
      appMessage.error(
        (err as any)?.message || "Tên tài khoản hoặc mật khẩu không chính xác!"
      );
    } finally {
      closeAppLoading();
    }
  };

  const hasShownAuthMessage = useRef(false);

  useEffect(() => {
    if (hasShownAuthMessage.current) return;

    const searchParams = new URLSearchParams(window.location.search);
    const expired = searchParams.get("expired");
    const forbidden = searchParams.get("forbidden");

    if (expired === "1") {
      appMessage?.warning(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
      );
    }
    if (forbidden === "1") {
      appMessage?.error("Bạn không có quyền truy cập trang này.");
    }

    hasShownAuthMessage.current = true;
  }, []);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <Logo />
        </div>

        <div className="login-form">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên tài khoản!" },
              ]}
            >
              <Input
                placeholder="Tên tài khoản"
                style={{ height: 50, width: 400 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                placeholder="Mật khẩu"
                style={{ height: 50, width: 400 }}
              />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" className="login-button" block>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
