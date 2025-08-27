import { POST_API_ENDPOINTS } from "@/constants/posts";
import { IdType } from "@/types/apis";
import { ReactionLabelEmojiMap, ReactionLabelType } from "@/types/reactions";

/**
 * 반응하기 ENUM을 EMOJI로 매핑하는 상수입니다.
 */
export const EMOTION_TO_EMOJI_MAP: ReactionLabelEmojiMap = {
  HAPPY: "❤️",
  SAD: "😢",
  ANGRY: "😠",
  EXCITED: "🎉",
  CONFUSED: "🤔",
  PROUD: "👏",
} as const;

/**
 * 반응하기의 API 엔드포인트 상수입니다.
 */
export const REACTION_API_ENDPOINTS = {
  /**
   * 게시글에 반응하기 API 엔드포인트
   * @param postId 게시글 ID
   */
  POST_REACTION: ({ postId }: { postId: string | number }) =>
    `${POST_API_ENDPOINTS.POST_DETAIL(postId)}/reactions`,

  /**
   * 게시글 반응 삭제 API 엔드포인트
   * @param postId 게시글 ID
   * @param type 삭제할 반응 타입
   */
  POST_REACTION_DELETE: ({ postId, type }: { postId: IdType, type: ReactionLabelType }) =>
    `${POST_API_ENDPOINTS.POST_DETAIL(postId)}/reactions/${type}`,

  /**
   * 댓글에 반응하기 API 엔드포인트
   * @param postId 게시글 ID
   * @param commentId 댓글 ID
   */
  COMMENT_REACTION: ({
    postId,
    commentId,
  }: {
    postId: IdType;
    commentId: IdType;
  }) => `/posts/${postId}/comments/${commentId}/reactions`,

  /**
   * 댓글 반응 삭제 API 엔드포인트
   * @param postId 게시글 ID
   * @param commentId 댓글 ID
   * @param type 삭제할 반응 타입
   */
  COMMENT_REACTION_DELETE: ({ postId, commentId, type }: { postId: IdType; commentId: IdType; type: ReactionLabelType }) =>
    `/posts/${postId}/comments/${commentId}/reactions/${type}`,
};
