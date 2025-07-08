import { client } from "./client";
import type {
  MyInfoGetResponse,
  MyInfoEditRequest,
  MyInfoEditResponse,
  MyPostListResponse,
  MyCommentListResponse,
  PaginationParams,
} from "@/types/members";

// 내 정보 조회
export async function getMyInfo(): Promise<MyInfoGetResponse> {
  return client.get<MyInfoGetResponse>("/members/me");
}

// 내 정보 수정
export async function updateMyInfo(
  data: MyInfoEditRequest,
): Promise<MyInfoEditResponse> {
  return client.put<MyInfoEditResponse>("/members/me", data);
}

// 내 게시글 목록 조회
export async function getMyPosts(
  params: PaginationParams,
): Promise<MyPostListResponse> {
  return client.get<MyPostListResponse>("/members/me/posts", params);
}

// 내 댓글 목록 조회
export async function getMyComments(
  params: PaginationParams,
): Promise<MyCommentListResponse> {
  return client.get<MyCommentListResponse>("/members/me/comments", params);
}
