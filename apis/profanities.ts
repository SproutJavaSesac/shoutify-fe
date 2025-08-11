import { api } from "@/apis/client";
import {
  ProfanityCreateRequest,
  ProfanityCreateResponse,
  ProfanityListResponse,
  ProfanityQueryParams,
  ProfanityUpdateRequest,
  ProfanityUpdateResponse,
} from "@/types/profanities";
import { PROFANITIES_API_ENDPOINTS } from "@/constants/profanities";
import { cleanApiParams } from "@/lib/utils/api-params";

/**
 * 금지어 목록을 조회합니다.
 * @param params 금지어 목록 조회 쿼리 파라미터
 * @return 금지어 목록 조회 결과
 */
export async function getProfanities(
  params: ProfanityQueryParams
): Promise<ProfanityListResponse> {
  // 빈 문자열과 null/undefined 값을 제거
  const cleanParams = cleanApiParams(params);

  return await api.public.get(
    PROFANITIES_API_ENDPOINTS.PROFANITIES,
    cleanParams
  );
}

/**
 * 새로운 금지어를 등록합니다.
 * @param request 금지어 생성 요청 객체
 * @return 생성된 금지어 정보
 */
export async function createProfanity(
  request: ProfanityCreateRequest
): Promise<ProfanityCreateResponse> {
  return await api.post(PROFANITIES_API_ENDPOINTS.PROFANITIES, request);
}

/**
 * 기존 금지어 정보를 수정합니다.
 * @param profanityId 수정할 금지어 ID
 * @param body 수정할 금지어 정보
 * @return 수정된 금지어 정보
 */
export async function updateProfanity({
  profanityId,
  body,
}: ProfanityUpdateRequest): Promise<ProfanityUpdateResponse> {
  return await api.patch(
    PROFANITIES_API_ENDPOINTS.PROFANITIES_UPDATE(profanityId),
    body
  );
}

/**
 * 금지어를 삭제합니다.
 * @param profanityId 삭제할 금지어 ID
 * @return 삭제 완료 메시지
 */
export async function deleteProfanity(profanityId: number): Promise<string> {
  return await api.delete(
    PROFANITIES_API_ENDPOINTS.PROFANITIES_DELETE(profanityId)
  );
}
