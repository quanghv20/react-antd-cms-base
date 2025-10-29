import { configService } from "../configs";
import type { IPermission, IPermissionPayload } from "./permission.types";

const BASE_PATH = "/auth-service/role/permissions";

export const permissionService = {
  /** 🔹 Lấy toàn bộ danh sách quyền */
  getAll: async (): Promise<IPermission[]> => {
    const res = await configService.get<IPermission[]>(BASE_PATH);
    return res.data;
  },

  /** 🔹 Lấy chi tiết quyền theo ID */
  getById: async (id: number): Promise<IPermission> => {
    const res = await configService.get<IPermission>(`${BASE_PATH}/${id}`);
    return res.data;
  },

  /** 🔹 Tạo mới quyền */
  create: async (payload: IPermissionPayload): Promise<IPermission> => {
    const res = await configService.post<IPermission>(BASE_PATH, payload);
    return res.data;
  },

  /** 🔹 Cập nhật quyền */
  update: async (payload: IPermissionPayload): Promise<IPermission> => {
    const res = await configService.put<IPermission>(
      `${BASE_PATH}/${payload.id}`,
      payload
    );
    return res.data;
  },

  /** 🔹 Xoá quyền */
  remove: async (id: number): Promise<void> => {
    await configService.delete(`${BASE_PATH}/${id}`);
  },
};
