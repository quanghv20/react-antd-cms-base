// utils/rsaEncrypt.ts
import JSEncrypt from "jsencrypt";

/**
 * publicKey: PEM string, ví dụ:
 * `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkq...IDAQAB\n-----END PUBLIC KEY-----`
 */
export function encryptWithPublicKey(
  publicKey: string,
  plain: string
): string | null {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(publicKey);
  const encrypted = jsEncrypt.encrypt(plain); // trả về base64 string hoặc null nếu lỗi
  return encrypted as string | null;
}
