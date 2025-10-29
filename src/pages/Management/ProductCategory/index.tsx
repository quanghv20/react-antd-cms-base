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
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

interface IProductCategory {
  id: string;
  name: string;
  description: string;
  status: 1 | 0; // 1: active, 0: inactive
  createdAt: string;
}

export default function ProductCategoryManagementPage() {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const initialData: IProductCategory[] = [
    {
      id: "DM001",
      name: "Đồ ăn",
      description: "Các món ăn chính",
      status: 1,
      createdAt: "21/07/2025",
    },
    {
      id: "DM002",
      name: "Đồ uống",
      description: "Các loại nước uống",
      status: 1,
      createdAt: "22/07/2025",
    },
    {
      id: "DM003",
      name: "Tráng miệng",
      description: "Bánh ngọt, chè, kem",
      status: 0,
      createdAt: "23/07/2025",
    },
  ];

  const [data, setData] = useState<IProductCategory[]>(initialData);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: initialData.length,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<IProductCategory | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState<IProductCategory | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  /** 🔹 Actions */
  const handleView = (item: IProductCategory) => {
    setViewingItem(item);
    setViewModalVisible(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (item: IProductCategory) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  const handleToggleStatus = (item: IProductCategory) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === item.id ? { ...d, status: d.status === 1 ? 0 : 1 } : d
      )
    );
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
          id: `DM${String(new Date().getTime()).slice(-4)}`,
          status: 1,
          createdAt: new Date().toLocaleDateString(),
          ...values,
        },
      ]);
    }
    setModalVisible(false);
  };

  /** 🔹 Columns */
  const columns: ColumnsType<IProductCategory> = [
    {
      title: "Mã danh mục",
      dataIndex: "id",
      key: "id",
      width: 160,
      align: "center",
    },
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (val: number) => (
        <Tag color={val === 1 ? "green" : "red"}>
          {val === 1 ? "Hoạt động" : "Ngưng hoạt động"}
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
            title="Bạn có chắc muốn xoá danh mục này?"
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
      <Card style={{ margin: "24px 0px" }} title="Tìm kiếm danh mục">
        <Form form={filterForm} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Mã danh mục" name="id">
                <Input placeholder="Nhập mã danh mục" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tên danh mục" name="name">
                <Input placeholder="Nhập tên danh mục" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
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
                const { id, name, status } = filterForm.getFieldsValue();
                setData(
                  initialData.filter((d) => {
                    return (
                      (!id || d.id.includes(id)) &&
                      (!name || d.name.includes(name)) &&
                      (status === undefined || d.status === status)
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
        <Button type="primary" onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={pagination}
        rowSelection={rowSelection}
      />

      {/* Modal tạo/cập nhật */}
      <Modal
        open={modalVisible}
        title={editingItem ? "Cập nhật danh mục" : "Thêm mới danh mục"}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Tên danh mục" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea placeholder="Mô tả danh mục" rows={3} />
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
        title="Thông tin danh mục"
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingItem && (
          <Descriptions
            column={1}
            bordered
            size="small"
            labelStyle={{ fontWeight: 500 }}
          >
            <Descriptions.Item label="Mã danh mục">
              {viewingItem.id}
            </Descriptions.Item>
            <Descriptions.Item label="Tên danh mục">
              {viewingItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {viewingItem.description}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {viewingItem.status === 1 ? (
                <Tag color="green">Hoạt động</Tag>
              ) : (
                <Tag color="red">Ngưng hoạt động</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {viewingItem.createdAt}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
