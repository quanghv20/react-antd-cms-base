import { configService } from "../configs";
import type {
  IDataLeakSearchParams,
  ISearchDataLeakResponse,
} from "./data-leak.type";

const BASE_PATH = "/cms-service/record";

export const dataLeakService = {
  /** 🔹 Lấy danh sách dữ liệu rò rỉ với phân trang và filter */
  search: async (
    params: IDataLeakSearchParams
  ): Promise<ISearchDataLeakResponse> => {
    const res = await configService.get(`${BASE_PATH}/search`, { params });
    return res.data;
  },
};
