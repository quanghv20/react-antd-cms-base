import { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  Popconfirm,
  Row,
  Col,
  Card,
  Tag,
  Button,
  Descriptions,
  Select,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

const { Option } = Select;

interface IUser {
  id: string;
  username: string;
  fullName: string;
  role: string;
  phone: string;
  status: 1 | 0; // 1: active, 0: inactive
  createdAt: string;
}

export default function UserManagementPage() {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  // Fake data
  const initialData: IUser[] = [
    {
      id: "MNV0001",
      username: "nguyentrgiang",
      fullName: "Nguyễn Trường Giang",
      role: "Khách hàng",
      phone: "0988 4545 56",
      status: 1,
      createdAt: "21/07/2025",
    },
    {
      id: "MNV0002",
      username: "nguyentrgiang2",
      fullName: "Nguyễn Trường Giang",
      role: "Nhân viên",
      phone: "0988 4545 56",
      status: 0,
      createdAt: "21/07/2025",
    },
    {
      id: "MNV0003",
      username: "nguyentrgiang3",
      fullName: "Nguyễn Trường Giang",
      role: "Quản trị",
      phone: "0988 4545 56",
      status: 1,
      createdAt: "21/07/2025",
    },
  ];

  const [data, setData] = useState<IUser[]>(initialData);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: initialData.length,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<IUser | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState<IUser | null>(null);

  // 1️⃣ Thêm state để lưu những dòng được chọn
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 2️⃣ rowSelection cho Table
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    // optional: có thể disable checkbox với điều kiện
    // getCheckboxProps: (record: IUser) => ({
    //   disabled: record.status === 0, // vd: disable với người dùng đã khóa
    // }),
  };

  /** 🔹 Actions */
  const handleView = (item: IUser) => {
    setViewingItem(item);
    setViewModalVisible(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (item: IUser) => {
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
          status: 1,
          createdAt: new Date().toLocaleDateString(),
          ...values,
        },
      ]);
    }
    setModalVisible(false);
  };

  const handleToggleStatus = (item: IUser) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === item.id ? { ...d, status: d.status === 1 ? 0 : 1 } : d
      )
    );
  };

  /** 🔹 Columns */
  const columns: ColumnsType<IUser> = [
    { title: "Mã NV", dataIndex: "id", key: "id", width: 120, align: "center" },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "SDT", dataIndex: "phone", key: "phone", align: "center" },
    { title: "Vai trò", dataIndex: "role", key: "role", align: "center" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (val: number) => (
        <Tag color={val === 1 ? "green" : "red"}>
          {val === 1 ? "Đang hoạt động" : "Ngưng hoạt động"}
        </Tag>
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
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handleView(record)}
          />
          <Popconfirm
            title={
              record.status === 1
                ? "Bạn có chắc muốn khoá tài khoản này?"
                : "Bạn có chắc muốn mở khoá tài khoản này?"
            }
            onConfirm={() => handleToggleStatus(record)}
            okText="Có"
            cancelText="Không"
          >
            {record.status === 1 ? (
              <LockOutlined style={{ color: "red", cursor: "pointer" }} />
            ) : (
              <UnlockOutlined style={{ color: "green", cursor: "pointer" }} />
            )}
          </Popconfirm>
          <Popconfirm
            title="Bạn có chắc muốn xoá người dùng này?"
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
      {/* Form tìm kiếm */}
      <Card style={{ margin: "24px 0px" }} title="Tìm kiếm người dùng">
        <Form form={filterForm} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Mã nhân viên" name="id">
                <Input placeholder="Nhập mã NV" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Tên người dùng" name="username">
                <Input placeholder="Nhập tên người dùng" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Vai trò" name="role">
                <Select allowClear placeholder="Chọn vai trò">
                  <Option value="Khách hàng">Khách hàng</Option>
                  <Option value="Nhân viên">Nhân viên</Option>
                  <Option value="Quản trị">Quản trị</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Trạng thái" name="status">
                <Select allowClear placeholder="Chọn trạng thái">
                  <Option value={1}>Hoạt động</Option>
                  <Option value={0}>Ngưng hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="flex-center">
            <Button
              type="primary"
              ghost
              onClick={() => {
                const { id, username, role, status } =
                  filterForm.getFieldsValue();

                setData(
                  initialData.filter((d) => {
                    return (
                      (!id || d.id.includes(id)) &&
                      (!username || d.username.includes(username)) &&
                      (!role || d.role === role) &&
                      (status === undefined ||
                        status === "" ||
                        d.status === status)
                    );
                  })
                );
              }}
            >
              Tìm kiếm
            </Button>
          </div>
        </Form>
      </Card>

      {/* Button tạo mới */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button type="primary" variant="solid" onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={pagination}
        rowSelection={rowSelection} // ✅ Thêm dòng này
      />

      {/* Modal tạo/cập nhật */}
      <Modal
        open={modalVisible}
        title={editingItem ? "Cập nhật người dùng" : "Thêm mới người dùng"}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Họ tên" />
          </Form.Item>

          <Form.Item
            label="Tên tài khoản"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên tài khoản" }]}
          >
            <Input placeholder="Tên tài khoản" />
          </Form.Item>

          <Form.Item
            label="SĐT"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng nhập vai trò" }]}
          >
            <Input placeholder="Vai trò" />
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
        title="Thông tin người dùng"
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {viewingItem && (
          <Descriptions
            column={1}
            bordered
            size="small"
            labelStyle={{ fontWeight: "500", color: "#333" }}
          >
            <Descriptions.Item label="Họ tên">
              {viewingItem.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Tên tài khoản">
              {viewingItem.username}
            </Descriptions.Item>
            <Descriptions.Item label="SĐT">
              {viewingItem.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              {viewingItem.role}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {viewingItem.status === 1 ? (
                <Tag color="green">Hoạt động</Tag>
              ) : (
                <Tag color="red">Ngưng hoạt động</Tag>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
