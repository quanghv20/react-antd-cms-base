/** Thông tin chi tiết một User */
export interface IUser {
  id: number;
  fullName: string;
  employeeCode: string;
  status: "ACTIVE" | "INACTIVE"; // hoặc string nếu có nhiều trạng thái
  avatar: string | null;
  email: string;
  createdBy: string;
  createdDate: string; // ISO date string
  lastModifiedBy: string;
  lastModifiedDate: string; // ISO date string
}

/** Payload để tạo hoặc cập nhật User */
export interface IUserPayload {
  id?: number; // id có khi chỉ dùng khi update
  fullName: string;
  employeeCode: string;
  status: "ACTIVE" | "INACTIVE";
  avatar?: string | null;
  email: string;
}

/** Params tìm kiếm và phân trang */
export interface IUserSearchParams {
  page?: number; // trang hiện tại
  size?: number; // số bản ghi mỗi trang
  fullName?: string; // filter theo tên
  employeeCode?: string; // filter theo mã nhân viên
  status?: "ACTIVE" | "INACTIVE"; // filter theo trạng thái
}

/** Response API trả về danh sách User với phân trang */
export interface IGetAllUserResponse {
  data: IUser[];
  count: number; // tổng số bản ghi
  page_size: number; // số bản ghi trên 1 trang
  total_pages: number; // tổng số trang
}
