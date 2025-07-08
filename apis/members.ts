import { apiClient } from "./client";
import type {
  MyInfoGetResponse,
  MyInfoEditRequest,
  MyInfoEditResponse,
  MyPostListResponse,
  MyCommentListResponse,
  PaginationParams,
  ApiResponse,
} from "@/types";

export class MembersAPI {
  /**
   * 내 정보를 조회합니다
   * @returns 내 정보
   */
  static async getMyInfo(): Promise<MyInfoGetResponse> {
    const response = await apiClient.get<ApiResponse<MyInfoGetResponse>>(
      "/members/me",
    );
    return response.data;
  }

  /**
   * 내 정보를 수정합니다
   * @param data 수정할 정보 (현재는 닉네임만)
   * @returns 수정된 정보
   */
  static async updateMyInfo(
    data: MyInfoEditRequest,
  ): Promise<MyInfoEditResponse> {
    const response = await apiClient.put<ApiResponse<MyInfoEditResponse>>(
      "/members/me",
      data,
    );
    return response.data;
  }

  /**
   * 내 게시글 목록을 조회합니다
   * @param params 페이지네이션 파라미터
   * @returns 내 게시글 목록
   */
  static async getMyPosts(
    params: PaginationParams = {},
  ): Promise<MyPostListResponse> {
    const { page = 0, size = 10 } = params;
    const response = await apiClient.get<ApiResponse<MyPostListResponse>>(
      "/members/me/posts",
      {
        params: { page, size },
      },
    );
    return response.data;
  }

  /**
   * 내 댓글 목록을 조회합니다
   * @param params 페이지네이션 파라미터
   * @returns 내 댓글 목록
   */
  static async getMyComments(
    params: PaginationParams = {},
  ): Promise<MyCommentListResponse> {
    const { page = 0, size = 10 } = params;
    const response = await apiClient.get<ApiResponse<MyCommentListResponse>>(
      "/members/me/comments",
      {
        params: { page, size },
      },
    );
    return response.data;
  }

  // TODO: 실제 API 구현 시 추가될 메서드들

  /**
   * 다른 사용자 정보 조회 (추후 구현 예정)
   * @param userId 사용자 ID
   */
  // static async getUserInfo(userId: number): Promise<UserProfile> {
  //   const response = await apiClient.get<ApiResponse<UserProfile>>(`/members/${userId}`)
  //   return response.data
  // }

  /**
   * 프로필 이미지 업로드 (추후 구현 예정)
   * @param file 이미지 파일
   */
  // static async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
  //   const formData = new FormData()
  //   formData.append('image', file)
  //   const response = await apiClient.post<ApiResponse<{ imageUrl: string }>>('/members/me/profile-image', formData, {
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   })
  //   return response.data
  // }

  /**
   * 회원 탈퇴 (추후 구현 예정)
   */
  // static async deleteAccount(): Promise<void> {
  //   await apiClient.delete('/members/me')
  // }
}
