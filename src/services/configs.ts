import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { authService } from "./auth/auth.service";
import { storage } from "@/utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// extend thêm field noAuth
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  noAuth?: boolean;
  _retry?: boolean;
}

// Tạo instance axios
const configService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: gắn Authorization (trừ khi có noAuth)
configService.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    if (!config.noAuth) {
      const accessToken = storage.getAccessToken();
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
configService.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const status = error.response?.status;

    // Case 401 hoặc 403: thử refresh token 1 lần
    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !originalRequest.noAuth &&
      !originalRequest.url?.includes("/auth/refresh") // tránh loop refresh
    ) {
      originalRequest._retry = true;

      try {
        // 🟢 Thử refresh token qua service có sẵn
        const res = await authService.refreshToken();

        if (res?.access_token) {
          const newAccessToken = res.access_token;
          const newRefreshToken = res.refresh_token;

          // Lưu token mới
          if (newRefreshToken) {
            storage.setAccessToken(newAccessToken);
            storage.setRefreshToken(newRefreshToken);
          }

          // Gắn token mới vào request gốc
          if (!originalRequest.headers) {
            originalRequest.headers = {} as any;
          }
          (
            originalRequest.headers as any
          ).Authorization = `Bearer ${newAccessToken}`;

          console.log("newAccessToken: ", newAccessToken);

          // ✅ Retry lại request gốc với token mới
          return configService(originalRequest);
        }
      } catch (refreshError) {
        // 🟥 Refresh token thất bại
        if (import.meta.env.MODE === "development") {
          console.error(
            "[Auth Interceptor] Refresh token failed:",
            refreshError
          );
        }

        // Nếu server trả về lỗi 401/403 khi refresh → clear và redirect
        const refreshStatus =
          (refreshError as AxiosError)?.response?.status ?? 0;
        if (refreshStatus === 401 || refreshStatus === 403) {
          localStorage.clear();
          window.location.href = "/login?expired=1";
        }
      }

      // 🟥 Nếu refresh thất bại (hoặc không có token mới) → xử lý như logic gốc
      if (status === 401) {
        localStorage.clear();
        window.location.href = "/login?expired=1";
      }

      if (status === 403) {
        window.location.href = "/login?forbidden=1";
      }
    }

    // 🔸 Normalize & reject lỗi
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      "Có lỗi xảy ra, vui lòng thử lại";

    if (import.meta.env.MODE === "development") {
      console.error("[Axios Error]", {
        url: error.config?.url,
        status,
        message,
      });
    }

    return Promise.reject(new Error(message));
  }
);

export { configService };
