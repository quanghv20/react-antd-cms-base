import React, { useState } from "react";
import { Layout } from "antd";
import { ROUTES } from "@/routes/routes";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import AppSider from "./sider/AppSider";
import AppHeader from "./header/AppHeader";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();

  let currentLabel = "";

  // xử lý riêng root "/"
  if (location.pathname === "/") {
    currentLabel = "Danh sách thống kê";
  } else {
    const currentRoute = ROUTES.find(
      (r) =>
        r.path !== "/" &&
        matchPath({ path: r.path, end: true }, location.pathname)
    );
    currentLabel = currentRoute?.label || "";
  }

  return (
    <Layout>
      <AppSider collapsed={collapsed} />
      <Layout style={{ marginLeft: collapsed ? 80 : 260 }}>
        <AppHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        <div
          style={{ background: "#fafafb", minHeight: "100vh", marginTop: 64 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#000",
              fontSize: 24,
              fontWeight: 700,
              margin: "16px 24px 0px",
            }}
          >
            {currentLabel}
          </div>

          <Content
            style={{
              borderRadius: 8,
              margin: "16px 24px",
            }}
          >
            <Outlet /> {/* render page theo route */}
          </Content>
        </div>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
