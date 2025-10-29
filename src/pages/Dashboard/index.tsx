import { Row, Col, Card, Statistic } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  // Data mẫu
  const weeklyOrders = [
    { day: "T2", orders: 30 },
    { day: "T3", orders: 70 },
    { day: "T4", orders: 80 },
    { day: "T5", orders: 74 },
    { day: "T6", orders: 73 },
    { day: "T7", orders: 35 },
    { day: "CN", orders: 10 },
  ];

  const stockData = [
    { day: "T2", inStock: 50, outStock: 17 },
    { day: "T3", inStock: 70, outStock: 7 },
    { day: "T4", inStock: 40, outStock: 0 },
    { day: "T5", inStock: 28, outStock: 3 },
    { day: "T6", inStock: 40, outStock: 3 },
    { day: "T7", inStock: 43, outStock: 3 },
    { day: "CN", inStock: 43, outStock: 3 },
  ];

  const weeklyRevenue = [
    { day: "T2", revenue: 30 },
    { day: "T3", revenue: 53 },
    { day: "T4", revenue: 68 },
    { day: "T5", revenue: 33 },
    { day: "T6", revenue: 17 },
    { day: "T7", revenue: 27 },
    { day: "CN", revenue: 63 },
  ];

  const serviceProgress = [
    { label: "Đã giao hàng", value: 80, color: "#49C5BE" },
    { label: "Chưa giao", value: 30, color: "#FFB547" },
    { label: "Chưa xử lý", value: 20, color: "#CD2C58" },
  ];

  return (
    <div>
      {/* Tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
                  Tổng đơn hôm nay
                </span>
              }
              value={250}
              valueStyle={{ color: "#871E8E", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
                  Doanh thu hôm nay
                </span>
              }
              value={8_567_658}
              valueStyle={{ fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
                  Sản phẩm còn hàng
                </span>
              }
              value={38}
              valueStyle={{ color: "#5D5FEF", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <span style={{ fontWeight: 600, fontSize: 16, color: "#000" }}>
                  Sản phẩm hết hàng
                </span>
              }
              value={8}
              valueStyle={{ color: "#FF541D", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            title={
              <span
                style={{
                  color: "#030229",
                  fontSize: 18,
                  fontWeight: "bold",
                  opacity: 0.7,
                }}
              >
                Số lượng đơn trong tuần
              </span>
            }
            style={{ height: "100%" }}
          >
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={weeklyOrders} barCategoryGap="20%" barGap={4}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                <Tooltip />
                <Bar dataKey="orders" fill="#5A99EC" maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title={
              <span
                style={{
                  color: "#030229",
                  fontSize: 18,
                  fontWeight: "bold",
                  opacity: 0.7,
                }}
              >
                Theo dõi sản phẩm trong kho
              </span>
            }
            style={{ height: "100%" }}
          >
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={stockData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="inStock"
                  fill="#49C5BE"
                  name="Sản phẩm còn"
                  maxBarSize={30}
                />
                <Bar
                  dataKey="outStock"
                  fill="#FFB547"
                  name="Sản phẩm hết"
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card
            title={
              <span
                style={{
                  color: "#030229",
                  fontSize: 18,
                  fontWeight: "bold",
                  opacity: 0.7,
                }}
              >
                Doanh thu trong tuần (triệu)
              </span>
            }
            style={{ height: "100%" }}
          >
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={weeklyRevenue} barCategoryGap="20%" barGap={4}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#F178B6"
                  maxBarSize={30}
                  name="Doanh thu"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title={
              <span
                style={{
                  color: "#030229",
                  fontSize: 18,
                  fontWeight: "bold",
                  opacity: 0.7,
                }}
              >
                Theo dõi tiến độ phục vụ
              </span>
            }
            style={{ height: "100%" }}
          >
            {serviceProgress.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  padding: "12px 16px",
                  fontSize: 18,
                  borderRadius: 6,
                  backgroundColor: "#f5f5f5",
                }}
              >
                <span style={{ fontWeight: 600 }}>{item.label}</span>
                <span
                  style={{
                    color: item.color,
                    fontWeight: "bold",
                    fontSize: 32,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
