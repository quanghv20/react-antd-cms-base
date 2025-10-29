import type { IPaginatedResponse } from "../type";

/** 🔹 Kiểu dữ liệu Client */
export interface IClient {
  id: number;
  clientId: string;
  clientName: string;
  description: string | null;
  status: number;
  userId: number | null;
  username: string | null;
}

/** 🔹 Payload khi tạo/cập nhật Client */
export interface IClientPayload {
  id?: number; // optional khi create
  clientName: string;
  status: number;
  userId?: number | null;
  description?: string | null;
}

/** 🔹 Tham số tìm kiếm Client */
export interface IClientSearchParams {
  username?: string;

  page?: number;
  pageSize?: number;
  sort?: string[];
}

/** 🔹 Phần mô tả phân trang */
export interface IPageable {
  pageNumber: number;
  pageSize: number;
  sort: any[]; // có thể chi tiết hơn nếu BE trả object sort
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

/** 🔹 Response khi gọi API getAll/search client */
export type IGetAllClientResponse = IPaginatedResponse<IClient>;
export type ISearchUsersResponse = IPaginatedResponse<{
  userId: number;
  username: string;
}>;
