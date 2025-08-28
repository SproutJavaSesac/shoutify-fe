import { PROOFREAD_API_ENDPOINTS } from "@/constants/proofreads";
import { ExtractResponse, MutationArgs } from "@/types/apis";
import {
  ProofreadCreateContract,
  ProofreadPublishContract,
} from "@/types/proofreads";
import { api } from "./client";

/**
 * 첨삭 요청 생성
 */
export const createProofread = async (
  args: MutationArgs<ProofreadCreateContract>
): Promise<ExtractResponse<ProofreadCreateContract>> => {
  return await api.post<ExtractResponse<ProofreadCreateContract>>(
    PROOFREAD_API_ENDPOINTS.CREATE,
    args
  );
};

/**
 * 첨삭 결과로 게시물 발행
 */
export const publishProofread = async (
  args: MutationArgs<ProofreadPublishContract>
): Promise<ExtractResponse<ProofreadPublishContract>> => {
  return await api.post<ExtractResponse<ProofreadPublishContract>>(
    PROOFREAD_API_ENDPOINTS.PUBLISH(args.paths.taskUuid),
    args.body
  );
};
