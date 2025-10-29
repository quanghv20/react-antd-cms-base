import type {
  AccountStatus,
  AccountType,
} from "@/pages/Settings/Account/enums";
import type { IPaginatedResponse } from "../type";

/** 🔹 Thông tin chi tiết tài khoản */
export interface IAccount {
  id: number;
  username: string;
  email: string;
  phone: string;
  gender: number; // 1 = Nam, 0 = Nữ (có thể enum sau)
  dob?: string | null; // ngày sinh
  address?: string | null;
  status: AccountStatus; // 1 = hoạt động, 0 = ngưng hoạt động
  fullname: string;
  type: AccountType; // 0 = hệ thống, 1 = user thường (ví dụ)
  createdBy?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: string | null;
  permissions?: string[] | null;
  roles?: string[];
}

/** 🔹 Payload để tạo/cập nhật tài khoản */
export interface IAccountPayload {
  id?: number;
  username: string;
  email: string;
  phone: string;
  gender: number;
  dob?: string | null;
  address?: string | null;
  status: number;
  fullname: string;
  type: number;
  permissions?: string[] | null;
}

/** 🔹 Params để filter + phân trang */
export interface IAccountSearchParams {
  username?: string;
  email?: string;
  phone?: string;
  statuses?: number[];
  page?: number;
  pageSize?: number;
}

/** 🔹 Response khi search account */
export type IGetAllAccountResponse = IPaginatedResponse<IAccount>;
