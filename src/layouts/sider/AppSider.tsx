import React, { useMemo } from "react";
import { Layout, Menu, type MenuProps } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router-dom";
import "./AppSider.css";
import Logo from "../Logo";
import LogoCollapsed from "../LogoCollapsed";
import { PATH } from "@/routes/path";
import { PERMISSIONS } from "@/constants";
import useHasPermission from "@/components/Permission/useHasPermission";

const { Sider } = Layout;

interface AppSiderProps {
  collapsed: boolean;
}
interface AppMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  allowedPermissions?: string[];
  children?: AppMenuItem[];
}

const AppSider: React.FC<AppSiderProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: AppMenuItem[] = [
    {
      key: PATH.DASHBOARD,
      icon: <DashboardOutlined />, // Dashboard vẫn hợp lý
      label: "Dashboard",
    },
    {
      key: "management",
      icon: <AppstoreOutlined />, // Quản lý tổng hợp
      label: "Quản lý",
      allowedPermissions: [],
      children: [
        {
          key: PATH.USER_MANAGEMENT,
          icon: <TeamOutlined />, // Người dùng / nhóm
          label: "Quản lý người dùng",
          allowedPermissions: [],
        },
        {
          key: PATH.PRODUCT_MANAGEMENT,
          icon: <ShopOutlined />, // Sản phẩm
          label: "Quản lý sản phẩm",
          allowedPermissions: [],
        },
        {
          key: PATH.ORDER_MANAGEMENT,
          icon: <ShoppingCartOutlined />, // Đơn hàng
          label: "Quản lý đơn hàng",
          allowedPermissions: [],
        },
        {
          key: PATH.PRODUCT_CATEGORY_MANAGEMENT,
          icon: <FileTextOutlined />, // Danh mục sản phẩm
          label: "Quản lý danh mục SP",
          allowedPermissions: [],
        },
      ],
    },
    {
      key: "settings",
      icon: <SettingOutlined />, // Cài đặt tổng
      label: "Cài đặt",
      allowedPermissions: [],
      children: [
        {
          key: PATH.REPORT,
          icon: <FileTextOutlined />, // Báo cáo
          label: "Báo cáo",
          allowedPermissions: [],
        },
        {
          key: PATH.NOTIFICATION,
          icon: <BellOutlined />, // Thông báo
          label: "Thông báo",
          allowedPermissions: [],
        },
        {
          key: PATH.SETTING,
          icon: <SettingOutlined />, // Cài đặt chi tiết
          label: "Cài đặt",
          allowedPermissions: [],
        },
      ],
    },
  ];

  const { permissions, hasPermission } = useHasPermission();

  const filterMenuByPermissions = (items: AppMenuItem[]): AppMenuItem[] => {
    return items
      .map((item) => {
        const isAllowed =
          !item.allowedPermissions || hasPermission(item.allowedPermissions);

        if (!isAllowed) return null;

        let children: AppMenuItem[] | undefined;
        if (item.children) {
          children = filterMenuByPermissions(item.children);
        }

        return { ...item, children };
      })
      .filter(Boolean) as AppMenuItem[];
  };

  const filteredMenuItems = useMemo(() => {
    // SUPER_ADMIN đã được handle trong hook -> hasPermission luôn true
    return filterMenuByPermissions(menuItems);
  }, [permissions]);

  // Tìm parentKey cho route hiện tại
  const openKeys = useMemo(() => {
    const path = location.pathname;
    const parent = menuItems.find((item) =>
      item.children?.some((child: any) => child.key === path)
    );
    return parent ? [parent.key] : [];
  }, [location.pathname]);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="app-sider"
      width={260}
    >
      <div className="logo-sider">
        {collapsed ? <LogoCollapsed /> : <Logo />}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]} // active item
        defaultOpenKeys={openKeys} // mở menu cha khi load
        onClick={({ key }) => {
          navigate(key.toString()); // đảm bảo là string
        }}
        items={filteredMenuItems as MenuProps["items"]}
        className="my-menu"
      />
    </Sider>
  );
};

export default AppSider;
