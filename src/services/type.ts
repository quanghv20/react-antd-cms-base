/** 🔹 Kiểu Pageable chung */
export interface IPageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
  sort?: any[]; // có thể refine thêm ISort nếu cần
}

/** 🔹 Kiểu response phân trang chung */
export interface IPaginatedResponse<T> {
  content: T[];
  pageable: IPageable | any; // tuỳ BE, nếu không đồng nhất thì để any
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort?: any[];
  first: boolean;
  numberOfElements?: number;
  empty: boolean;
}
