import { api } from "./client";
import type {
  MyCommentListResponse,
  MyInfoEditRequest,
  MyInfoEditResponse,
  MyPostListResponse,
  PaginationParams,
} from "@/types/members";

// 회원 정보 조회
export const getMemberInfo = async () => {
  return api.get("/members/me");
};

// 내 정보 수정
export async function updateMyInfo(
  data: MyInfoEditRequest,
): Promise<MyInfoEditResponse> {
  return api.put<MyInfoEditResponse>("/members/me", data);
}

// 내 게시글 목록 조회
export async function getMyPosts(
  params: PaginationParams,
): Promise<MyPostListResponse> {
  return api.get<MyPostListResponse>("/members/me/posts", params);
}

// 내 댓글 목록 조회
export async function getMyComments(
  params: PaginationParams,
): Promise<MyCommentListResponse> {
  return api.get<MyCommentListResponse>("/members/me/comments", params);
}
