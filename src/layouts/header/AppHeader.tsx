import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Layout, Menu, Typography } from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/path";
import { STORAGE_KEYS } from "@/constants";

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");

  const firstLetter = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    // Xoá toàn bộ localStorage
    localStorage.clear();

    // Redirect về login
    navigate(PATH.LOGIN);
  };

  useEffect(() => {
    const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_LOGGED);
    if (userInfoStr) {
      const user = JSON.parse(userInfoStr);
      setUsername(user.username || "");
    }
  }, []);

  const menu = (
    <Menu
      items={[
        {
          key: "PROFILE",
          icon: <UserOutlined />,
          label: <span>Tài khoản</span>,
        },
        {
          key: "LOGOUT",
          icon: <LogoutOutlined style={{ color: "red" }} />,
          label: <span>Đăng xuất</span>,
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        left: collapsed ? 80 : 260, // lùi theo sidebar
        right: 0,
        height: 64,
        zIndex: 10,
        background: "#fff",
        padding: "0px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "left 0.3s ease", // mượt khi collapsed toggle
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />

      {/* Avatar + username */}
      <Dropdown overlay={menu} placement="bottomRight">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            gap: 8,
          }}
        >
          <Avatar size="small" style={{ backgroundColor: "#ff541d" }}>
            {firstLetter || "U"}
          </Avatar>
          <Typography.Text strong>
            {username.toUpperCase() || "USER"}
          </Typography.Text>
        </div>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
