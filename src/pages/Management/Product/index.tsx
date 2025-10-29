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
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const { Option } = Select;

interface IProduct {
  id: string;
  name: string;
  category: "Đồ ăn" | "Đồ uống";
  price: number;
  status: 1 | 0; // 1: có bán, 0: ngưng bán
  createdAt: string;
}

export default function ProductManagementPage() {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  // Fake data
  const initialData: IProduct[] = [
    {
      id: "SP0001",
      name: "Bánh mì thịt",
      category: "Đồ ăn",
      price: 20000,
      status: 1,
      createdAt: "21/07/2025",
    },
    {
      id: "SP0002",
      name: "Cà phê sữa",
      category: "Đồ uống",
      price: 15000,
      status: 1,
      createdAt: "22/07/2025",
    },
    {
      id: "SP0003",
      name: "Trà chanh",
      category: "Đồ uống",
      price: 12000,
      status: 0,
      createdAt: "23/07/2025",
    },
  ];

  const [data, setData] = useState<IProduct[]>(initialData);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: initialData.length,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<IProduct | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState<IProduct | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  /** 🔹 Actions */
  const handleView = (item: IProduct) => {
    setViewingItem(item);
    setViewModalVisible(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (item: IProduct) => {
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
          id: `SP${String(new Date().getTime()).slice(-4)}`,
          status: 1,
          createdAt: new Date().toLocaleDateString(),
          ...values,
        },
      ]);
    }
    setModalVisible(false);
  };

  const handleToggleStatus = (item: IProduct) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === item.id ? { ...d, status: d.status === 1 ? 0 : 1 } : d
      )
    );
  };

  /** 🔹 Columns */
  const columns: ColumnsType<IProduct> = [
    { title: "Mã SP", dataIndex: "id", key: "id", width: 120, align: "center" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Loại", dataIndex: "category", key: "category", align: "center" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (val: number) => val.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (val: number) => (
        <Tag color={val === 1 ? "green" : "red"}>
          {val === 1 ? "Đang bán" : "Ngưng bán"}
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
            title="Bạn có chắc muốn xoá sản phẩm này?"
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
      <Card style={{ margin: "24px 0px" }} title="Tìm kiếm sản phẩm">
        <Form form={filterForm} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Mã sản phẩm" name="id">
                <Input placeholder="Nhập mã SP" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Tên sản phẩm" name="name">
                <Input placeholder="Nhập tên sản phẩm" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Loại" name="category">
                <Select allowClear placeholder="Chọn loại">
                  <Option value="Đồ ăn">Đồ ăn</Option>
                  <Option value="Đồ uống">Đồ uống</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Trạng thái" name="status">
                <Select allowClear placeholder="Chọn trạng thái">
                  <Option value={1}>Đang bán</Option>
                  <Option value={0}>Ngưng bán</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="flex-center">
            <Button
              type="primary"
              ghost
              onClick={() => {
                const { id, name, category, status } =
                  filterForm.getFieldsValue();
                setData(
                  initialData.filter((d) => {
                    return (
                      (!id || d.id.includes(id)) &&
                      (!name || d.name.includes(name)) &&
                      (!category || d.category === category) &&
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
        title={editingItem ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Tên sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Loại"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn loại" }]}
          >
            <Select placeholder="Chọn loại">
              <Option value="Đồ ăn">Đồ ăn</Option>
              <Option value="Đồ uống">Đồ uống</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <Input type="number" placeholder="Giá sản phẩm" />
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
        title="Thông tin sản phẩm"
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {viewingItem && (
          <Descriptions
            column={1}
            bordered
            size="small"
            labelStyle={{ fontWeight: 500 }}
          >
            <Descriptions.Item label="Tên sản phẩm">
              {viewingItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="Loại">
              {viewingItem.category}
            </Descriptions.Item>
            <Descriptions.Item label="Giá">
              {viewingItem.price.toLocaleString("vi-VN")} đ
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {viewingItem.status === 1 ? (
                <Tag color="green">Đang bán</Tag>
              ) : (
                <Tag color="red">Ngưng bán</Tag>
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
