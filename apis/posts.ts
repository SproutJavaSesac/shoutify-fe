import { api } from "./client";
import type { PostsApiResponse, PostQueryParams } from "@/types/posts";

// 게시글 목록 조회
export async function getPosts(
  params?: PostQueryParams,
): Promise<PostsApiResponse> {
  try {
    return await api.getPublic<PostsApiResponse>("/posts", params);
  } catch (error) {
    console.warn("게시글 목록 조회 실패:", error);
    throw error;
  }
}

// 게시글 상세 조회
export async function getPost(postId: number) {
  try {
    return await api.getPublic(`/posts/${postId}`);
  } catch (error) {
    console.warn("게시글 상세 조회 실패:", error);
    throw error;
  }
}

// 게시글 작성
export async function createPost(data: {
  beforeTitle: string;
  beforeContent: string;
  conceptType: string;
  imageFile?: File;
}) {
  return api.post("/posts", data);
}

// 게시글 수정
export async function updatePost(
  postId: number,
  data: {
    beforeTitle?: string;
    beforeContent?: string;
    conceptType?: string;
    imageFile?: File;
  },
) {
  return api.put(`/posts/${postId}`, data);
}

// 게시글 삭제
export async function deletePost(postId: number) {
  return api.delete(`/posts/${postId}`);
}
