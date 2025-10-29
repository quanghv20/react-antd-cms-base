import { useState } from "react";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Popconfirm,
  Row,
  Col,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

const { Option } = Select;

interface INotification {
  id: string;
  title: string;
  content: string;
  type: "Thông báo" | "Khuyến mãi" | "Cảnh báo";
  status: 0 | 1; // 0: chưa đọc, 1: đã đọc
  createdAt: string;
}

export default function NotificationPage() {
  const [form] = Form.useForm();
  const [data, setData] = useState<INotification[]>([
    {
      id: "1",
      title: "Đơn hàng #MNV0001 đã được xác nhận",
      content: "Đơn hàng của bạn đã được xác nhận và đang chuẩn bị giao.",
      type: "Thông báo",
      status: 0,
      createdAt: "2025-10-28 08:30",
    },
    {
      id: "2",
      title: "Khuyến mãi 10% tất cả đồ uống",
      content: "Áp dụng từ ngày 28/10 đến 31/10.",
      type: "Khuyến mãi",
      status: 0,
      createdAt: "2025-10-27 09:00",
    },
    {
      id: "3",
      title: "Đơn hàng #MNV0002 bị hủy",
      content: "Đơn hàng của bạn đã bị hủy do hết nguyên liệu.",
      type: "Cảnh báo",
      status: 1,
      createdAt: "2025-10-26 14:20",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<INotification | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState<INotification | null>(null);

  /** 🔹 Actions */
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (item: INotification) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    if (editingItem) {
      setData((prev) =>
        prev.map((d) => (d.id === editingItem.id ? { ...d, ...values } : d))
      );
    } else {
      setData((prev) => [
        ...prev,
        {
          id: String(new Date().getTime()),
          status: 0,
          createdAt: new Date().toLocaleString(),
          ...values,
        },
      ]);
    }
    setModalVisible(false);
  };

  const handleToggleStatus = (item: INotification) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === item.id ? { ...d, status: d.status === 1 ? 0 : 1 } : d
      )
    );
  };

  /** 🔹 Columns */
  const columns: ColumnsType<INotification> = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Loại", dataIndex: "type", key: "type", align: "center" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (val: number) =>
        val === 1 ? (
          <Tag color="green">Đã đọc</Tag>
        ) : (
          <Tag color="red">Chưa đọc</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setViewingItem(record);
              setViewModalVisible(true);
            }}
          />
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xoá thông báo này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Button tạo mới */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button type="primary" onClick={handleAdd}>
          Thêm thông báo
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal tạo/cập nhật */}
      <Modal
        open={modalVisible}
        title={editingItem ? "Cập nhật thông báo" : "Thêm thông báo"}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Tiêu đề" />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input.TextArea placeholder="Nội dung" rows={4} />
          </Form.Item>
          <Form.Item
            label="Loại"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại" }]}
          >
            <Select placeholder="Chọn loại">
              <Option value="Thông báo">Thông báo</Option>
              <Option value="Khuyến mãi">Khuyến mãi</Option>
              <Option value="Cảnh báo">Cảnh báo</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button
              onClick={() => setModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Huỷ
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        open={viewModalVisible}
        title="Thông tin thông báo"
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={500}
      >
        {viewingItem && (
          <div>
            <p>
              <strong>Tiêu đề:</strong> {viewingItem.title}
            </p>
            <p>
              <strong>Nội dung:</strong> {viewingItem.content}
            </p>
            <p>
              <strong>Loại:</strong> {viewingItem.type}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {viewingItem.status === 1 ? (
                <Tag color="green">Đã đọc</Tag>
              ) : (
                <Tag color="red">Chưa đọc</Tag>
              )}
            </p>
            <p>
              <strong>Ngày tạo:</strong> {viewingItem.createdAt}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
