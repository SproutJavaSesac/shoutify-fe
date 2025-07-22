import { api } from "./client";
import {
  CreatePostRequest,
  CreatePostResponse,
  Post,
  PostQueryParams,
  PostsResult,
} from "@/types/posts";
import { API_ENDPOINTS } from "@/constants/posts";

// 게시글 목록 조회
export async function getPosts(params?: PostQueryParams): Promise<PostsResult> {
  try {
    return await api.public.get<PostsResult>(API_ENDPOINTS.POSTS, params);
  } catch (error) {
    console.warn("게시글 목록 조회 실패:", error);
    throw error;
  }
}

// 게시글 상세 조회
export async function getPost(postId: number): Promise<Post> {
  try {
    return await api.public.get(`/posts/${postId}`);
  } catch (error) {
    console.warn("게시글 상세 조회 실패:", error);
    throw error;
  }
}

export const createPost = async (
  data: CreatePostRequest,
): Promise<CreatePostResponse> => {
  return api.post<CreatePostResponse>(API_ENDPOINTS.POSTS_CREATE, data);
};

// 게시글 삭제
export async function deletePost(postId: number) {
  return api.delete(`/posts/${postId}`);
}
