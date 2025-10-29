import { Modal, Descriptions, Tag } from "antd";
import type { IUser } from "@/services/user/user.type";
import { formatDateToDMY } from "@/utils/date.utils";

interface IUserViewModalProps {
  visible: boolean;
  item?: IUser | null;
  onCancel: () => void;
}

export default function UserViewModal({
  visible,
  item,
  onCancel,
}: IUserViewModalProps) {
  if (!item) return null;

  return (
    <Modal
      open={visible}
      title="Thông tin người dùng"
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Descriptions
        column={1}
        bordered
        size="small"
        labelStyle={{ fontWeight: "500", color: "#333" }}
      >
        <Descriptions.Item label="Họ tên">{item.fullName}</Descriptions.Item>
        <Descriptions.Item label="Mã NV">{item.employeeCode}</Descriptions.Item>
        <Descriptions.Item label="Email">{item.email}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {item.status === "ACTIVE" ? (
            <Tag color="green">Hoạt động</Tag>
          ) : (
            <Tag color="red">Ngưng hoạt động</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {formatDateToDMY(item.createdDate)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}
