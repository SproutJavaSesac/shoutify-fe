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

/**
 * 비속어 목록을 조회합니다.
 * @param params 비속어 목록 조회 쿼리 파라미터
 * @return 비속어 목록 조회 결과
 */
export async function getProfanities(
  params: ProfanityQueryParams,
): Promise<ProfanityListResponse> {
  return await api.public.get(PROFANITIES_API_ENDPOINTS.PROFANITIES, params);
}

/**
 * 비속어를 생성합니다.
 * @param request 비속어 생성 요청 객체
 * @return 생성된 비속어 정보
 */
export async function createProfanity(
  request: ProfanityCreateRequest,
): Promise<ProfanityCreateResponse> {
  return await api.post(PROFANITIES_API_ENDPOINTS.PROFANITIES, request);
}

/**
 * 비속어를 수정합니다.
 * @param profanityId 수정할 비속어 ID
 * @param body 수정할 비속어 정보
 * @return 수정된 비속어 정보
 */
export async function updateProfanity({
  profanityId,
  body,
}: ProfanityUpdateRequest): Promise<ProfanityUpdateResponse> {
  return await api.patch(
    PROFANITIES_API_ENDPOINTS.PROFANITIES_UPDATE(profanityId),
    body,
  );
}

/**
 * 비속어를 삭제합니다.
 * @param profanityId 삭제할 비속어 ID
 */
export async function deleteProfanity(profanityId: number): Promise<string> {
  return await api.delete(
    PROFANITIES_API_ENDPOINTS.PROFANITIES_DELETE(profanityId),
  );
}
