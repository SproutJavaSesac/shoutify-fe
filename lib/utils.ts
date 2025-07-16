import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UTC 날짜 문자열을 사용자의 로케일에 맞는 날짜 문자열로 변환합니다.
 *
 * @example
 * ```typescript
 * const utcDate = "2023-10-01T12:00:00Z";
 * const localDate = utcToLocaleDateString(utcDate);
 * console.log(localDate); // en-US "10-01-2023, 12:00:00 PM", ko-KR "2023-10-01, 오후 12:00:00"
 * ```
 * @param utcDateString - UTC 날짜 문자열 또는 Date 객체
 * @return 사용자의 로케일에 맞춘 날짜 문자열
 */
export function utcToLocaleDateString(utcDateString: Date | string): string {
  const date = new Date(utcDateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  // undefined 사용 시 사용자의 로케일을 자동으로 감지하여 적용
  return date.toLocaleString(undefined, options).replace(/\//g, "-");
}
