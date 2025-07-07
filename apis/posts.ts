import { apiClient } from "./client";
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostsResponse,
  PostQueryParams,
  PostCategory,
  PostEmotion,
} from "@/types/posts";

export class PostsApi {
  private readonly basePath = "/posts";

  // 게시글 목록 조회
  async getPosts(params?: PostQueryParams): Promise<PostsResponse> {
    return apiClient.get<PostsResponse>(this.basePath, params);
  }

  // 게시글 상세 조회
  async getPost(id: number): Promise<Post> {
    return apiClient.get<Post>(`${this.basePath}/${id}`);
  }

  // 게시글 작성
  async createPost(data: CreatePostRequest): Promise<Post> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category);

    if (data.emotion) {
      formData.append("emotion", data.emotion);
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    return apiClient.post<Post>(this.basePath, formData);
  }

  // 게시글 수정
  async updatePost(data: UpdatePostRequest): Promise<Post> {
    const { id, ...updateData } = data;
    return apiClient.put<Post>(`${this.basePath}/${id}`, updateData);
  }

  // 게시글 삭제
  async deletePost(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  // 특정 사용자의 게시글 조회
  async getUserPosts(
    userId: string,
    params?: Omit<PostQueryParams, "author">,
  ): Promise<PostsResponse> {
    return apiClient.get<PostsResponse>(
      `${this.basePath}/user/${userId}`,
      params,
    );
  }

  // 인기 게시글 조회
  async getPopularPosts(params?: {
    period?: "daily" | "weekly" | "monthly";
    limit?: number;
  }): Promise<Post[]> {
    return apiClient.get<Post[]>(`${this.basePath}/popular`, params);
  }

  // 추천 게시글 조회
  async getRecommendedPosts(userId?: string): Promise<Post[]> {
    const params = userId ? { userId } : undefined;
    return apiClient.get<Post[]>(`${this.basePath}/recommended`, params);
  }

  // 게시글 검색
  async searchPosts(
    query: string,
    params?: Omit<PostQueryParams, "search">,
  ): Promise<PostsResponse> {
    return apiClient.get<PostsResponse>(`${this.basePath}/search`, {
      search: query,
      ...params,
    });
  }

  // 카테고리별 게시글 조회
  async getPostsByCategory(
    category: PostCategory,
    params?: Omit<PostQueryParams, "category">,
  ): Promise<PostsResponse> {
    return apiClient.get<PostsResponse>(
      `${this.basePath}/category/${category}`,
      params,
    );
  }

  // 감정별 게시글 조회
  async getPostsByEmotion(
    emotion: PostEmotion,
    params?: Omit<PostQueryParams, "emotion">,
  ): Promise<PostsResponse> {
    return apiClient.get<PostsResponse>(
      `${this.basePath}/emotion/${emotion}`,
      params,
    );
  }

  // 게시글 북마크
  async bookmarkPost(postId: number): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/${postId}/bookmark`);
  }

  // 게시글 북마크 해제
  async unbookmarkPost(postId: number): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${postId}/bookmark`);
  }

  // 사용자의 북마크된 게시글 조회
  async getBookmarkedPosts(params?: PostQueryParams): Promise<PostsResponse> {
    return apiClient.get<PostsResponse>(`${this.basePath}/bookmarked`, params);
  }

  // 게시글 숨기기/표시
  async togglePostVisibility(postId: number, isHidden: boolean): Promise<void> {
    return apiClient.patch<void>(`${this.basePath}/${postId}/visibility`, {
      isHidden,
    });
  }
}

// API 인스턴스 생성 및 내보내기
export const postsApi = new PostsApi();
