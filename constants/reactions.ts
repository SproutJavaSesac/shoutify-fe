import { POST_API_ENDPOINTS } from "@/constants/posts";

/**
 * 반응하기 ENUM을 EMOJI로 매핑하는 상수입니다.
 */
export const EMOTION_TO_EMOJI_MAP = {
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
   * 댓글에 반응하기 API 엔드포인트
   * @param postId 게시글 ID
   * @param commentId 댓글 ID
   */
  COMMENT_REACTION: ({
    postId,
    commentId,
  }: {
    postId: string | number;
    commentId: string | number;
  }) => `/posts/${postId}/comments/${commentId}/reactions`,
};
