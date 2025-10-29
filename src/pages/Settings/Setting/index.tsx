import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  TimePicker,
  Switch,
  Tabs,
  message,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const { TabPane } = Tabs;

export default function SettingsPage() {
  const [companyForm] = Form.useForm();
  const [timeForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  const [settings, setSettings] = useState({
    company: {
      name: "Công ty ABC",
      address: "123 Đường XYZ, Hà Nội",
      phone: "0988 123 456",
    },
    hours: {
      open: "08:00",
      close: "17:00",
    },
    notifications: {
      email: true,
      push: true,
    },
  });

  const handleSaveCompany = () => {
    const values = companyForm.getFieldsValue();
    setSettings((prev) => ({ ...prev, company: values }));
    message.success("Lưu thông tin công ty thành công!");
  };

  const handleSaveHours = () => {
    const values = timeForm.getFieldsValue();
    setSettings((prev) => ({
      ...prev,
      hours: {
        open: values.open.format("HH:mm"),
        close: values.close.format("HH:mm"),
      },
    }));
    message.success("Lưu giờ phục vụ thành công!");
  };

  const handleSaveNotifications = () => {
    const values = notificationForm.getFieldsValue();
    setSettings((prev) => ({ ...prev, notifications: values }));
    message.success("Lưu cài đặt thông báo thành công!");
  };

  return (
    <div>
      <Card title="Cài đặt hệ thống">
        <Tabs defaultActiveKey="1">
          {/* Thông tin công ty */}
          <TabPane tab="Thông tin công ty" key="1">
            <Form
              form={companyForm}
              layout="vertical"
              initialValues={settings.company}
            >
              <Form.Item
                label="Tên công ty"
                name="name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Tên công ty" />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true }]}
              >
                <Input placeholder="Địa chỉ công ty" />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true }]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleSaveCompany}>
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Giờ phục vụ */}
          <TabPane tab="Giờ phục vụ" key="2">
            <Form
              form={timeForm}
              layout="vertical"
              initialValues={{
                open: settings.hours.open
                  ? dayjs(settings.hours.open, "HH:mm")
                  : undefined,
                close: settings.hours.close
                  ? dayjs(settings.hours.close, "HH:mm")
                  : undefined,
              }}
            >
              <Form.Item
                label="Giờ mở cửa"
                name="open"
                rules={[{ required: true }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
              <Form.Item
                label="Giờ đóng cửa"
                name="close"
                rules={[{ required: true }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleSaveHours}>
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Cài đặt thông báo */}
          <TabPane tab="Thông báo" key="3">
            <Form
              form={notificationForm}
              layout="vertical"
              initialValues={settings.notifications}
            >
              <Form.Item
                label="Email thông báo"
                name="email"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                label="Push thông báo"
                name="push"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleSaveNotifications}>
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
