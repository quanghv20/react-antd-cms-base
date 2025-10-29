import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { storage } from "@/utils/storage";
import { configService } from "../configs";

export interface IAuthLoginPayload {
  username: string;
  password: string;
}

export interface IAuthLoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface IAuthRefreshTokenResponse extends IAuthLoginResponse {}

export const authService = {
  login: async (payload: IAuthLoginPayload): Promise<IAuthLoginResponse> => {
    const res = await configService.post<IAuthLoginResponse>(
      "/auth/login",
      payload,
      { noAuth: true } as AxiosRequestConfig
    );

    const data = res.data;

    return data;
  },

  refreshToken: async (): Promise<IAuthRefreshTokenResponse | null> => {
    try {
      const refreshToken = storage.getRefreshToken();

      if (!refreshToken) return null;

      const res = await axios.post<IAuthRefreshTokenResponse>(
        import.meta.env.VITE_API_BASE_URL + "/auth/refresh",
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
};
