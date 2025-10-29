import qs from "qs";
import { configService } from "../configs";
import type {
  IClient,
  IClientPayload,
  IClientSearchParams,
  IGetAllClientResponse,
  ISearchUsersResponse,
} from "./client.type";

const BASE_PATH = "/auth-service/client";

export const clientService = {
  /** 🔹 Lấy danh sách client với phân trang và filter */
  search: async (
    params: IClientSearchParams
  ): Promise<IGetAllClientResponse> => {
    const res = await configService.get(`${BASE_PATH}/search`, {
      params,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return res.data;
  },

  /** 🔹 Lấy chi tiết client theo ID */
  getById: async (id: number): Promise<IClient> => {
    const res = await configService.get<IClient>(`${BASE_PATH}/${id}`);
    return res.data;
  },

  /** 🔹 Tạo mới client */
  create: async (payload: IClientPayload): Promise<IClient> => {
    const res = await configService.post<IClient>(
      `${BASE_PATH}/create`,
      payload
    );
    return res.data;
  },

  /** 🔹 Cập nhật client */
  update: async (payload: IClientPayload): Promise<IClient> => {
    const res = await configService.post<IClient>(
      `${BASE_PATH}/update`,
      payload
    );
    return res.data;
  },

  /** 🔹 Xoá client */
  remove: async (ids: string[]): Promise<void> => {
    await configService.post(`${BASE_PATH}/delete`, { ids });
  },

  enable: async (ids: string[]): Promise<void> => {
    await configService.post(`${BASE_PATH}/enable`, { ids });
  },

  disable: async (ids: string[]): Promise<void> => {
    await configService.post(`${BASE_PATH}/disable`, { ids });
  },

  /** 🔹 Lấy danh sách users với phân trang */
  searchUsers: async (params: {
    username?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ISearchUsersResponse> => {
    const res = await configService.get(`${BASE_PATH}/users`, {
      params,
    });
    return res.data;
  },
};
