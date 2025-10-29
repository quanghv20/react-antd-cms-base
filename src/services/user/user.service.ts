import qs from "qs";
import { configService } from "../configs";
import type {
  IUser,
  IUserPayload,
  IUserSearchParams,
  IGetAllUserResponse,
} from "./user.type";

const BASE_PATH = "/user";

export const userService = {
  /** 🔹 Lấy danh sách User với phân trang và filter */
  search: async (params: IUserSearchParams): Promise<IGetAllUserResponse> => {
    const res = await configService.get<IGetAllUserResponse>(BASE_PATH, {
      params,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return res.data;
  },

  /** 🔹 Lấy chi tiết User theo ID */
  getById: async (id: number): Promise<IUser> => {
    const res = await configService.get<IUser>(`${BASE_PATH}/${id}`);
    return res.data;
  },

  /** 🔹 Tạo mới User */
  create: async (payload: IUserPayload): Promise<IUser> => {
    const res = await configService.post<IUser>(BASE_PATH, payload);
    return res.data;
  },

  /** 🔹 Cập nhật User */
  update: async (id: number, payload: IUserPayload): Promise<IUser> => {
    const res = await configService.put<IUser>(`${BASE_PATH}/${id}`, payload);
    return res.data;
  },

  /** 🔹 Xoá User */
  remove: async (ids: number[]): Promise<void> => {
    await configService.delete(BASE_PATH, { data: { ids } });
  },

  /** 🔹 Gán roles cho User */
  assignRoles: async (payload: {
    id: number | string;
    roles: string[];
  }): Promise<IUser> => {
    const res = await configService.post<IUser>(
      `${BASE_PATH}/assign-role`,
      payload
    );
    return res.data;
  },
};
