import { STORAGE_KEYS } from "@/constants";

export const storage = {
  /** Lưu dữ liệu vào localStorage */
  set<T>(key: string, value: T): void {
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(key, data);
    } catch (error) {
      console.error(`Error setting storage key "${key}"`, error);
    }
  },

  /** Lấy dữ liệu từ localStorage (tự parse JSON nếu hợp lệ) */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error getting storage key "${key}"`, error);
      return null;
    }
  },

  /** Xóa một key */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing storage key "${key}"`, error);
    }
  },

  /** Xóa toàn bộ dữ liệu (nếu cần) */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing storage", error);
    }
  },

  /** ------------------------
   *  ACCESS TOKEN
   * ------------------------ */
  setAccessToken(token: string) {
    this.set(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  getAccessToken(): string | null {
    return this.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  },

  removeAccessToken() {
    this.remove(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /** ------------------------
   *  REFRESH TOKEN
   * ------------------------ */
  setRefreshToken(token: string) {
    this.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  getRefreshToken(): string | null {
    return this.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  },

  removeRefreshToken() {
    this.remove(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /** ------------------------
   *  USER LOGGED
   * ------------------------ */
  setUserLogged(user: Record<string, any>) {
    this.set(STORAGE_KEYS.USER_LOGGED, user);
  },

  getUserLogged<T = Record<string, any>>(): T | null {
    return this.get<T>(STORAGE_KEYS.USER_LOGGED);
  },

  removeUserLogged() {
    this.remove(STORAGE_KEYS.USER_LOGGED);
  },
};
