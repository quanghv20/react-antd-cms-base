import qs from "qs";
import { configService } from "../configs";
import type {
  IAccount,
  IAccountPayload,
  IAccountSearchParams,
  IGetAllAccountResponse,
} from "./account.type";

const BASE_PATH = "/auth-service/user";

export const accountService = {
  /** 🔹 Lấy danh sách account với phân trang và filter */
  search: async (
    params: IAccountSearchParams
  ): Promise<IGetAllAccountResponse> => {
    const res = await configService.get(`${BASE_PATH}/search`, {
      params,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return res.data;
  },

  /** 🔹 Lấy chi tiết account theo ID */
  getById: async (id: number): Promise<IAccount> => {
    const res = await configService.get<IAccount>(`${BASE_PATH}/${id}`);
    return res.data;
  },

  /** 🔹 Tạo mới account */
  create: async (payload: IAccountPayload): Promise<IAccount> => {
    const res = await configService.post<IAccount>(
      `${BASE_PATH}/create`,
      payload
    );
    return res.data;
  },

  /** 🔹 Cập nhật account */
  update: async (payload: IAccountPayload): Promise<IAccount> => {
    const res = await configService.post<IAccount>(
      `${BASE_PATH}/update`,
      payload
    );
    return res.data;
  },

  /** 🔹 Xoá account */
  remove: async (ids: number[]): Promise<void> => {
    await configService.post(`${BASE_PATH}/delete`, { ids });
  },

  /** 🔹 Gán roles cho account */
  assignRoles: async (payload: {
    id: number | string;
    roles: string[];
  }): Promise<IAccount> => {
    const res = await configService.post<IAccount>(
      `${BASE_PATH}/assign-role`,
      payload
    );
    return res.data;
  },
};
