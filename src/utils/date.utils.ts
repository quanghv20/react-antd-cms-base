import dayjs, { Dayjs } from "dayjs";

export const formatDateToDMY = (inputDate: string | Date | Dayjs): string => {
  if (!inputDate) return "";
  return dayjs(inputDate).format("DD/MM/YYYY");
};

export const formatDateToYMD = (inputDate: string | Date | Dayjs): string => {
  if (!inputDate) return "";
  return dayjs(inputDate).format("YYYY/MM/DD");
};

/** Trả về hôm nay */
export const getToday = (): Dayjs => {
  return dayjs();
};

/** Trả về ngày cách đây 1 tháng */
export const getOneMonthAgo = (): Dayjs => {
  return dayjs().subtract(1, "month");
};
