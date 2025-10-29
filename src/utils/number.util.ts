/**
 * Format số kiểu Việt Nam (ngăn cách bằng dấu chấm)
 * @param value number hoặc string
 * @returns string đã format
 */
export function formatVND(value: number | string = 0): string {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numberValue)) return "0";

  // Chuyển sang string với định dạng vi-VN
  const parts = numberValue.toFixed(0).split("."); // loại bỏ thập phân
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // thêm dấu . cho phần nghìn
}

/**
 * Format số kiểu VN kèm ký hiệu VND
 * @param value number hoặc string
 * @returns string ví dụ: "14.000.000 ₫"
 */
export function formatVNDWithSymbol(value: number | string = 0): string {
  return `${formatVND(value)} ₫`;
}

export function numberToVietnameseWords(n: number): string {
  n = Math.floor(n + 0.5); // làm tròn .4 xuống, .5 trở lên
  if (n === 0) return "Không đồng";

  const UNITS = ["", " nghìn", " triệu", " tỷ"];
  const DIGITS = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];

  function readTriple(num: number): string {
    const hundreds = Math.floor(num / 100);
    const tens = Math.floor((num % 100) / 10);
    const ones = num % 10;
    let str = "";

    if (hundreds > 0) {
      str += DIGITS[hundreds] + " trăm";
      if (tens === 0 && ones > 0) str += " lẻ";
    }

    if (tens > 1) {
      str += (str ? " " : "") + DIGITS[tens] + " mươi";
      if (ones === 1) str += " mốt";
      else if (ones === 4) str += " tư";
      else if (ones === 5) str += " lăm";
      else if (ones > 1) str += " " + DIGITS[ones];
    } else if (tens === 1) {
      str += (str ? " " : "") + "mười";
      if (ones === 1) str += " một";
      else if (ones === 4) str += " bốn";
      else if (ones === 5) str += " lăm";
      else if (ones > 1) str += " " + DIGITS[ones];
    } else if (tens === 0 && ones > 0) {
      str += (str ? " " : "") + DIGITS[ones];
    }

    return str || "không";
  }

  let result = "";
  let unitIndex = 0;

  while (n > 0) {
    const triple = n % 1000;
    if (triple !== 0) {
      let read = readTriple(triple);
      result = read + UNITS[unitIndex] + (result ? " " + result : "");
    }
    n = Math.floor(n / 1000);
    unitIndex++;
  }

  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result + " đồng";
}
