import type { IPaginatedResponse } from "../type";

export interface IRole {
  id: number;
  name: string;
  description?: string | null;
  code: string;
}

export interface IRolePayload {
  id?: number;
  name: string;
  description?: string;
  code: string;
}

export interface IRoleSearchParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export type IGetAllRoleResponse = IPaginatedResponse<IRole>;
