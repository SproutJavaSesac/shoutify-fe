import { api } from "./client";
import {
  Post,
  PostCreateContract,
  PostDeleteContract,
  PostPaginationContract,
  PostPaginationResponse,
} from "@/types/posts";
import { POST_API_ENDPOINTS } from "@/constants/posts";
import {
  ApiPaginationArgs,
  ExtractResponse,
  IdType,
  MutationArgs,
} from "@/types/apis";

// 게시글 목록 조회
export async function getPosts(
  args?: ApiPaginationArgs<PostPaginationContract>,
): Promise<PostPaginationResponse> {
  try {
    // query 파라미터가 있는 경우, args에서 쿼리 파라미터를 추출
    return await api.public.get(POST_API_ENDPOINTS.POSTS, args?.queries);
  } catch (error) {
    console.warn("게시글 목록 조회 실패:", error);
    throw error;
  }
}

// 게시글 상세 조회
export async function getPost(postId: string | number): Promise<Post> {
  try {
    return await api.public.get(POST_API_ENDPOINTS.POST_DETAIL(postId));
  } catch (error) {
    console.warn("게시글 상세 조회 실패:", error);
    throw error;
  }
}

export const createPost = async (
  data: MutationArgs<PostCreateContract>,
): Promise<ExtractResponse<PostCreateContract>> => {
  return api.post<ExtractResponse<PostCreateContract>>(
    POST_API_ENDPOINTS.POSTS_CREATE,
    data,
  );
};

// 게시글 삭제
export async function deletePost(postId: IdType): Promise<string> {
  return api.delete<ExtractResponse<PostDeleteContract>>(
    POST_API_ENDPOINTS.POST_DELETE(postId),
  );
}

// 게시글 숨김
export async function hidePost(postId: string | number): Promise<string> {
  return api.patch(POST_API_ENDPOINTS.POST_HIDE(postId));
}

// 게시글 공개
export async function unhidePost(postId: string | number): Promise<string> {
  return api.patch(POST_API_ENDPOINTS.POST_UNHIDE(postId));
}
