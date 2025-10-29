import { configService } from "../configs";
import type {
  IGetAllRoleResponse,
  IRole,
  IRolePayload,
  IRoleSearchParams,
} from "./role.type";

const BASE_PATH = "/auth-service/role";

export const roleService = {
  /** 🔹 Lấy toàn bộ danh sách role */
  getAll: async (): Promise<IRole[]> => {
    const res = await configService.get(`${BASE_PATH}/all`);
    return res.data;
  },

  /** 🔹 Lấy danh sách role với phân trang và filter */
  search: async (params: IRoleSearchParams): Promise<IGetAllRoleResponse> => {
    const res = await configService.get(`${BASE_PATH}/search`, { params });
    return res.data;
  },

  /** 🔹 Lấy chi tiết role theo ID */
  getById: async (id: number): Promise<IRole> => {
    const res = await configService.get<IRole>(`${BASE_PATH}/${id}`);
    return res.data;
  },

  /** 🔹 Tạo mới role */
  create: async (payload: IRolePayload): Promise<IRole> => {
    const res = await configService.post<IRole>(`${BASE_PATH}/create`, payload);
    return res.data;
  },

  /** 🔹 Cập nhật role */
  update: async (payload: IRolePayload): Promise<IRole> => {
    const res = await configService.post<IRole>(`${BASE_PATH}/update`, payload);
    return res.data;
  },

  /** 🔹 Xoá role */
  remove: async (ids: number[]): Promise<void> => {
    await configService.post(`${BASE_PATH}/delete`, { ids });
  },
};
