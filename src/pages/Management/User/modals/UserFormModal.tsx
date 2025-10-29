import { Modal, Form, Input, Button } from "antd";
import type { IUser, IUserPayload } from "@/services/user/user.type";

interface IUserFormModalProps {
  visible: boolean;
  item?: IUser | null;
  onCancel: () => void;
  onSubmit: (values: IUserPayload) => void;
}

export default function UserFormModal({
  visible,
  item,
  onCancel,
  onSubmit,
}: IUserFormModalProps) {
  const [form] = Form.useForm<IUserPayload>();

  // Set form khi edit
  if (item) {
    form.setFieldsValue(item);
  } else {
    form.resetFields();
  }

  const handleFinish = (values: IUserPayload) => {
    onSubmit(values);
  };

  return (
    <Modal
      open={visible}
      title={item ? "Cập nhật người dùng" : "Thêm mới người dùng"}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Họ tên" />
        </Form.Item>

        <Form.Item
          label="Mã NV"
          name="employeeCode"
          rules={[{ required: true, message: "Vui lòng nhập mã NV" }]}
        >
          <Input placeholder="Mã NV" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        {/* Chỉ hiển thị password khi tạo mới */}
        {!item && (
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
        )}

        <Form.Item style={{ textAlign: "right" }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Huỷ
          </Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
