/**
 * API 파라미터 정제 유틸리티 함수들
 */

/**
 * 객체에서 빈 문자열과 null/undefined 값을 제거합니다.
 * @param params 정제할 파라미터 객체
 * @returns 정제된 파라미터 객체
 */
export function cleanApiParams<T extends Record<string, any>>(
  params: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      // 빈 문자열, null, undefined, 프론트엔드 전용 값들 제거
      if (value === "" || value == null || value === "__ALL__") return false;
      // 빈 배열 제거 (선택적)
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
  ) as Partial<T>;
}

/**
 * 쿼리 파라미터에서 필터 값들을 안전하게 처리합니다.
 * @param value 필터 값
 * @returns 안전하게 처리된 값 (빈 문자열과 "__ALL__"은 undefined로 변환)
 */
export function sanitizeFilterValue<T>(
  value: T | "" | "__ALL__" | null | undefined
): T | undefined {
  if (value === "" || value === "__ALL__" || value == null) return undefined;
  return value as T;
}
