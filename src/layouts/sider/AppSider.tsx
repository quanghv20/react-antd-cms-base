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
      icon: <DashboardOutlined />,
      label: "Dashboard",
      allowedPermissions: [PERMISSIONS.DASHBOARD_VIEW],
    },
    {
      key: "management",
      icon: <AppstoreOutlined />,
      label: "Quản lý",
      allowedPermissions: [
        PERMISSIONS.USER_READ,
        PERMISSIONS.PRODUCT_READ,
        PERMISSIONS.ORDER_READ,
        PERMISSIONS.PRODUCT_CATEGORY_READ,
      ],
      children: [
        {
          key: PATH.USER_MANAGEMENT,
          icon: <TeamOutlined />,
          label: "Quản lý người dùng",
          allowedPermissions: [
            PERMISSIONS.USER_READ,
            PERMISSIONS.USER_CREATE,
            PERMISSIONS.USER_UPDATE,
            PERMISSIONS.USER_DELETE,
          ],
        },
        {
          key: PATH.PRODUCT_MANAGEMENT,
          icon: <ShopOutlined />,
          label: "Quản lý sản phẩm",
          allowedPermissions: [
            PERMISSIONS.PRODUCT_READ,
            PERMISSIONS.PRODUCT_CREATE,
            PERMISSIONS.PRODUCT_UPDATE,
            PERMISSIONS.PRODUCT_DELETE,
          ],
        },
        {
          key: PATH.ORDER_MANAGEMENT,
          icon: <ShoppingCartOutlined />,
          label: "Quản lý đơn hàng",
          allowedPermissions: [
            PERMISSIONS.ORDER_READ,
            PERMISSIONS.ORDER_CREATE,
            PERMISSIONS.ORDER_UPDATE,
            PERMISSIONS.ORDER_DELETE,
          ],
        },
        {
          key: PATH.PRODUCT_CATEGORY_MANAGEMENT,
          icon: <FileTextOutlined />,
          label: "Quản lý danh mục SP",
          allowedPermissions: [
            PERMISSIONS.PRODUCT_CATEGORY_READ,
            PERMISSIONS.PRODUCT_CATEGORY_CREATE,
            PERMISSIONS.PRODUCT_CATEGORY_UPDATE,
            PERMISSIONS.PRODUCT_CATEGORY_DELETE,
          ],
        },
      ],
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      allowedPermissions: [
        PERMISSIONS.ROLE_READ,
        PERMISSIONS.SETTING_READ,
        PERMISSIONS.NOTIFICATION_READ,
        PERMISSIONS.REPORT_VIEW,
      ],
      children: [
        {
          key: PATH.REPORT,
          icon: <FileTextOutlined />,
          label: "Báo cáo",
          allowedPermissions: [
            PERMISSIONS.REPORT_VIEW,
            PERMISSIONS.REPORT_EXPORT,
          ],
        },
        {
          key: PATH.NOTIFICATION,
          icon: <BellOutlined />,
          label: "Thông báo",
          allowedPermissions: [
            PERMISSIONS.NOTIFICATION_READ,
            PERMISSIONS.NOTIFICATION_CREATE,
            PERMISSIONS.NOTIFICATION_UPDATE,
            PERMISSIONS.NOTIFICATION_DELETE,
          ],
        },
        {
          key: PATH.SETTING,
          icon: <SettingOutlined />,
          label: "Cài đặt hệ thống",
          allowedPermissions: [
            PERMISSIONS.SETTING_READ,
            PERMISSIONS.SETTING_UPDATE,
          ],
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
