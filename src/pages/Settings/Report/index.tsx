import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  DatePicker,
  Select,
  Button,
  Statistic,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Option } = Select;

interface IOrderReport {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  cancelledOrders: number;
}

interface IProductReport {
  name: string;
  quantity: number;
}

export default function ReportPage() {
  // Fake data
  const orderData: IOrderReport[] = [
    {
      date: "2025-10-22",
      totalOrders: 20,
      totalRevenue: 400000,
      completedOrders: 15,
      cancelledOrders: 2,
    },
    {
      date: "2025-10-23",
      totalOrders: 25,
      totalRevenue: 500000,
      completedOrders: 20,
      cancelledOrders: 3,
    },
    {
      date: "2025-10-24",
      totalOrders: 18,
      totalRevenue: 350000,
      completedOrders: 16,
      cancelledOrders: 1,
    },
    {
      date: "2025-10-25",
      totalOrders: 30,
      totalRevenue: 600000,
      completedOrders: 25,
      cancelledOrders: 2,
    },
    {
      date: "2025-10-26",
      totalOrders: 22,
      totalRevenue: 450000,
      completedOrders: 18,
      cancelledOrders: 4,
    },
  ];

  const productData: IProductReport[] = [
    { name: "Bánh mì thịt", quantity: 30 },
    { name: "Cà phê sữa", quantity: 20 },
    { name: "Trà chanh", quantity: 25 },
    { name: "Kem", quantity: 15 },
  ];

  const [filteredOrders, setFilteredOrders] = useState(orderData);

  const columns: ColumnsType<IOrderReport> = [
    { title: "Ngày", dataIndex: "date", key: "date", align: "center" },
    {
      title: "Tổng đơn",
      dataIndex: "totalOrders",
      key: "totalOrders",
      align: "center",
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      align: "right",
      render: (val) => val.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Đơn hoàn tất",
      dataIndex: "completedOrders",
      key: "completedOrders",
      align: "center",
    },
    {
      title: "Đơn huỷ",
      dataIndex: "cancelledOrders",
      key: "cancelledOrders",
      align: "center",
    },
  ];

  const COLORS = ["#5A99EC", "#49C5BE", "#FFB547", "#FF541D"];

  return (
    <div>
      {/* Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => {
                if (!dates) return setFilteredOrders(orderData);
                const [start, end] = dates;
                setFilteredOrders(
                  orderData.filter((d) =>
                    dayjs(d.date).isBetween(start, end, "day", "[]")
                  )
                );
              }}
            />
          </Col>
          <Col span={8}>
            <Select
              allowClear
              style={{ width: "100%" }}
              placeholder="Trạng thái đơn"
              onChange={(value) => {
                if (!value) return setFilteredOrders(orderData);
                setFilteredOrders(
                  orderData.filter((d) => {
                    if (value === "completed") return d.completedOrders > 0;
                    if (value === "cancelled") return d.cancelledOrders > 0;
                    return true;
                  })
                );
              }}
            >
              <Option value="completed">Hoàn tất</Option>
              <Option value="cancelled">Huỷ</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={() => setFilteredOrders(orderData)}>
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
                  Tổng đơn
                </span>
              }
              value={filteredOrders.reduce((a, b) => a + b.totalOrders, 0)}
              valueStyle={{ fontWeight: "bold", color: "#5A99EC" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
                  Doanh thu
                </span>
              }
              value={filteredOrders.reduce((a, b) => a + b.totalRevenue, 0)}
              valueStyle={{ fontWeight: "bold", color: "#FF541D" }}
              formatter={(val) => Number(val).toLocaleString("vi-VN") + " đ"}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
                  Đơn hoàn tất
                </span>
              }
              value={filteredOrders.reduce((a, b) => a + b.completedOrders, 0)}
              valueStyle={{ fontWeight: "bold", color: "#49C5BE" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
                  Đơn huỷ
                </span>
              }
              value={filteredOrders.reduce((a, b) => a + b.cancelledOrders, 0)}
              valueStyle={{ fontWeight: "bold", color: "#FFB547" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card
            title={
              <span style={{ fontWeight: "bold", opacity: 0.7 }}>
                Doanh thu theo ngày
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredOrders} barGap={4} barCategoryGap="20%">
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#FF541D" maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <span style={{ fontWeight: "bold", opacity: 0.7 }}>
                Sản phẩm bán chạy
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={productData}
                  dataKey="quantity"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {productData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Bảng chi tiết */}
      <Card
        title={
          <span style={{ fontWeight: "bold", opacity: 0.7 }}>
            Chi tiết đơn hàng
          </span>
        }
      >
        <Table
          rowKey="date"
          columns={columns}
          dataSource={filteredOrders}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}
