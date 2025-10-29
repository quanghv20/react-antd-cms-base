import { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Button,
  Descriptions,
  Select,
  DatePicker,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";

const { Option } = Select;

interface IOrder {
  id: string;
  customer: string;
  items: { product: string; quantity: number; price: number }[];
  total: number;
  status: "Đang xử lý" | "Đang giao" | "Hoàn tất" | "Huỷ";
  orderDate: string;
  deliveryDate?: string;
}

export default function OrderManagementPage() {
  const [filterForm] = Form.useForm();

  const initialData: IOrder[] = [
    {
      id: "DH0001",
      customer: "Nguyễn Văn A",
      items: [
        { product: "Bánh mì thịt", quantity: 2, price: 20000 },
        { product: "Cà phê sữa", quantity: 1, price: 15000 },
      ],
      total: 55000,
      status: "Đang xử lý",
      orderDate: "28/10/2025",
    },
    {
      id: "DH0002",
      customer: "Trần Thị B",
      items: [{ product: "Trà chanh", quantity: 3, price: 12000 }],
      total: 36000,
      status: "Đang giao",
      orderDate: "27/10/2025",
      deliveryDate: "28/10/2025",
    },
    {
      id: "DH0003",
      customer: "Lê Văn C",
      items: [
        { product: "Bánh mì thịt", quantity: 1, price: 20000 },
        { product: "Trà chanh", quantity: 2, price: 12000 },
      ],
      total: 44000,
      status: "Hoàn tất",
      orderDate: "26/10/2025",
      deliveryDate: "27/10/2025",
    },
  ];

  const [data, setData] = useState<IOrder[]>(initialData);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: initialData.length,
  });

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState<IOrder | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) =>
      setSelectedRowKeys(newSelectedRowKeys),
  };

  /** 🔹 Actions */
  const handleView = (item: IOrder) => {
    setViewingItem(item);
    setViewModalVisible(true);
  };

  const handleUpdateStatus = (id: string, newStatus: IOrder["status"]) => {
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  /** 🔹 Columns */
  const columns: ColumnsType<IOrder> = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 120,
    },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (val: number) => val.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (val: IOrder["status"]) => {
        let color = "blue";
        if (val === "Đang xử lý") color = "orange";
        if (val === "Đang giao") color = "cyan";
        if (val === "Hoàn tất") color = "green";
        if (val === "Huỷ") color = "red";
        return <Tag color={color}>{val}</Tag>;
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      align: "center",
    },
    {
      title: "Ngày giao",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
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
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Form tìm kiếm */}
      <Card style={{ margin: "24px 0px" }} title="Tìm kiếm đơn hàng">
        <Form form={filterForm} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Mã đơn" name="id">
                <Input placeholder="Nhập mã đơn" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Khách hàng" name="customer">
                <Input placeholder="Nhập tên khách hàng" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Trạng thái" name="status">
                <Select allowClear placeholder="Chọn trạng thái">
                  <Option value="Đang xử lý">Đang xử lý</Option>
                  <Option value="Đang giao">Đang giao</Option>
                  <Option value="Hoàn tất">Hoàn tất</Option>
                  <Option value="Huỷ">Huỷ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Ngày đặt" name="orderDate">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex-center">
            <Button
              type="primary"
              ghost
              onClick={() => {
                const { id, customer, status, orderDate } =
                  filterForm.getFieldsValue();
                setData(
                  initialData.filter((d) => {
                    return (
                      (!id || d.id.includes(id)) &&
                      (!customer || d.customer.includes(customer)) &&
                      (!status || d.status === status) &&
                      (!orderDate ||
                        d.orderDate === orderDate?.format("DD/MM/YYYY"))
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

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={pagination}
        rowSelection={rowSelection}
      />

      {/* Modal xem chi tiết */}
      <Modal
        open={viewModalVisible}
        title="Chi tiết đơn hàng"
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingItem && (
          <>
            <Descriptions
              column={1}
              bordered
              size="small"
              labelStyle={{ fontWeight: 500 }}
            >
              <Descriptions.Item label="Mã đơn">
                {viewingItem.id}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {viewingItem.customer}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    viewingItem.status === "Đang xử lý"
                      ? "orange"
                      : viewingItem.status === "Đang giao"
                      ? "cyan"
                      : viewingItem.status === "Hoàn tất"
                      ? "green"
                      : "red"
                  }
                >
                  {viewingItem.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {viewingItem.orderDate}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày giao">
                {viewingItem.deliveryDate || "-"}
              </Descriptions.Item>
            </Descriptions>

            <Card
              size="small"
              title="Chi tiết sản phẩm"
              style={{ marginTop: 16 }}
            >
              <Table
                size="small"
                rowKey={(record) => record.product}
                columns={[
                  { title: "Sản phẩm", dataIndex: "product", key: "product" },
                  {
                    title: "Số lượng",
                    dataIndex: "quantity",
                    key: "quantity",
                    align: "center",
                  },
                  {
                    title: "Giá",
                    dataIndex: "price",
                    key: "price",
                    align: "right",
                    render: (val: number) => val.toLocaleString("vi-VN") + " đ",
                  },
                  {
                    title: "Thành tiền",
                    key: "total",
                    align: "right",
                    render: (_, record) =>
                      (record.quantity * record.price).toLocaleString("vi-VN") +
                      " đ",
                  },
                ]}
                dataSource={viewingItem.items}
                pagination={false}
              />
              <div
                style={{ textAlign: "right", marginTop: 8, fontWeight: 500 }}
              >
                Tổng: {viewingItem.total.toLocaleString("vi-VN")} đ
              </div>
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
}
