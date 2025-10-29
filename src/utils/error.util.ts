import { appMessage } from "./message";

/** 🔹 Chuẩn hoá error thành message string */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (typeof (err as any)?.message === "string") return (err as any).message;
  return "Có lỗi xảy ra, vui lòng thử lại";
}

/** 🔹 Show error bằng appMessage.error */
export function showErrMessage(err: unknown) {
  appMessage.error(getErrorMessage(err));
}
