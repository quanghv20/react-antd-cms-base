import {
  DashboardPage,
  UserManagementPage,
  ProductManagementPage,
  OrderManagementPage,
  ProductCategoryManagementPage,
  ReportPage,
  NotificationPage,
  SettingPage,
} from "@/pages";
import { PATH } from "./path";
import type { ComponentType } from "react";
import { PERMISSIONS } from "@/constants";

export interface IRoute {
  key: string;
  path: string;
  element: ComponentType;
  label: string;
  allowBack?: boolean;
  requiredPermissions?: string | string[];
}

export const ROUTES: IRoute[] = [
  {
    key: "THONG_KE",
    path: "/",
    element: DashboardPage,
    label: "Thống kê",
  },

  /** QUẢN LÝ */
  {
    key: PATH.USER_MANAGEMENT,
    path: PATH.USER_MANAGEMENT,
    element: UserManagementPage,
    label: "Quản lý người dùng",
    requiredPermissions: [],
  },
  {
    key: PATH.PRODUCT_MANAGEMENT,
    path: PATH.PRODUCT_MANAGEMENT,
    element: ProductManagementPage,
    label: "Quản lý sản phẩm",
    requiredPermissions: [],
  },
  {
    key: PATH.ORDER_MANAGEMENT,
    path: PATH.ORDER_MANAGEMENT,
    element: OrderManagementPage,
    label: "Quản lý đơn hàng",
    requiredPermissions: [],
  },
  {
    key: PATH.PRODUCT_CATEGORY_MANAGEMENT,
    path: PATH.PRODUCT_CATEGORY_MANAGEMENT,
    element: ProductCategoryManagementPage,
    label: "Quản lý danh mục sản phẩm",
    requiredPermissions: [],
  },

  /** CÀI ĐẶT */
  {
    key: PATH.REPORT,
    path: PATH.REPORT,
    element: ReportPage,
    label: "Báo cáo",
    requiredPermissions: [],
  },
  {
    key: PATH.NOTIFICATION,
    path: PATH.NOTIFICATION,
    element: NotificationPage,
    label: "Thông báo",
    requiredPermissions: [],
  },
  {
    key: PATH.SETTING,
    path: PATH.SETTING,
    element: SettingPage,
    label: "Cài đặt",
    requiredPermissions: [],
  },
];
