import { api } from "./client";
import {
  CreatePostRequest,
  CreatePostResponse,
  Post,
  PostListReponse,
  PostQueryParams,
} from "@/types/posts";
import { POST_API_ENDPOINTS } from "@/constants/posts";

// 게시글 목록 조회
export async function getPosts(
  params?: PostQueryParams,
): Promise<PostListReponse> {
  try {
    return await api.public.get(POST_API_ENDPOINTS.POSTS, params);
  } catch (error) {
    console.warn("게시글 목록 조회 실패:", error);
    throw error;
  }
}

// 게시글 상세 조회
export async function getPost(postId: number): Promise<Post> {
  try {
    return await api.public.get(POST_API_ENDPOINTS.POST_DETAIL(postId));
  } catch (error) {
    console.warn("게시글 상세 조회 실패:", error);
    throw error;
  }
}

export const createPost = async (
  data: CreatePostRequest,
): Promise<CreatePostResponse> => {
  return api.post<CreatePostResponse>(POST_API_ENDPOINTS.POSTS_CREATE, data);
};

// 게시글 삭제
export async function deletePost(postId: number): Promise<string> {
  return api.delete(POST_API_ENDPOINTS.POST_DELETE(postId));
}

// 게시글 숨김
export async function hidePost(postId: number): Promise<string> {
  return api.patch(POST_API_ENDPOINTS.POST_HIDE(postId));
}

// 게시글 공개
export async function unhidePost(postId: number): Promise<string> {
  return api.patch(POST_API_ENDPOINTS.POST_UNHIDE(postId));
}
