import { STORAGE_KEYS } from "@/constants";
import { configService } from "../configs";
import type { AxiosRequestConfig } from "axios";
import type { IUserDetail } from "./auth.types";
import axios from "axios";

export interface IAuthLoginPayload {
  username: string;
  password: string;
}

export interface IAuthToken {
  token: string;
  duration: number;
}

export interface IAuthLoginResponse {
  accessToken: IAuthToken;
  refreshToken: IAuthToken;
}

export interface IAuthRefreshTokenResponse extends IAuthLoginResponse {}

export const authService = {
  login: async (payload: IAuthLoginPayload): Promise<IAuthLoginResponse> => {
    const res = await configService.post<IAuthLoginResponse>(
      "/auth-service/auth/login",
      payload,
      { noAuth: true } as AxiosRequestConfig
    );

    const data = res.data;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken.token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken.token);

    return data;
  },

  refreshToken: async (): Promise<IAuthRefreshTokenResponse | null> => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) return null;

      const res = await axios.post<IAuthRefreshTokenResponse>(
        import.meta.env.VITE_API_BASE_URL + "/auth-service/auth/refresh",
        {}, // body rỗng
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`, // gửi refresh token
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      return res.data;
    } catch (error) {
      return null;
    }
  },

  ping: async () => {
    const res = await configService.get("/public/ping", {
      noAuth: true,
    } as AxiosRequestConfig);

    const data = res.data;

    return data;
  },

  /** 🔹 Lấy thông tin user đã đăng nhập */
  getUserDetail: async (): Promise<IUserDetail> => {
    const res = await configService.get<IUserDetail>(
      "/auth-service/user/detail"
    );
    return res.data;
  },
};
