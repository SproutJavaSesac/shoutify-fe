import { createProofread, publishProofread } from "@/apis/proofreads";
import { ApiOptions, MutationArgs } from "@/types/apis";
import {
  ProofreadCreateContract,
  ProofreadCreateResponse,
  ProofreadPublishContract,
  ProofreadPublishResponse,
} from "@/types/proofreads";
import { useCallback } from "react";
import { useMutation } from "./useApi";

/**
 * 첨삭 생성 훅
 */
export function useProofreadCreate(
  options: ApiOptions<ProofreadCreateResponse> = {}
) {
  const mutationFn = useCallback(
    async (args: MutationArgs<ProofreadCreateContract>) => {
      return await createProofread(args);
    },
    []
  );

  return useMutation<ProofreadCreateContract>(mutationFn, options);
}

/**
 * 첨삭 게시물 발행 훅
 */
export function useProofreadPublish(
  options: ApiOptions<ProofreadPublishResponse> = {}
) {
  const mutationFn = useCallback(
    async (args: MutationArgs<ProofreadPublishContract>) => {
      return await publishProofread(args);
    },
    []
  );

  return useMutation<ProofreadPublishContract>(mutationFn, options);
}
