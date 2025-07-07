import { apiClient } from "./client";
import type {
  User,
  UserProfile,
  LoginRequest,
  UpdateProfileRequest,
  UserStats,
  UserActivity,
  Badge,
} from "@/types/users";

export class UsersApi {
  private readonly basePath = "/users";
  private readonly authPath = "/auth";

  // 로그인
  async login(data: LoginRequest): Promise<{ user: User; token: string }> {
    const result = await apiClient.post<{ user: User; token: string }>(
      `${this.authPath}/login`,
      data,
    );

    // 토큰을 로컬 스토리지에 저장하고 API 클라이언트에 설정
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", result.token);
      apiClient.setAuthToken(result.token);
    }

    return result;
  }

  // 로그아웃
  async logout(): Promise<void> {
    try {
      await apiClient.post<void>(`${this.authPath}/logout`);
    } finally {
      // 로그아웃 API 호출 실패해도 로컬에서는 정리
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        apiClient.removeAuthToken();
      }
    }
  }

  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(`${this.authPath}/me`);
  }

  // 사용자 프로필 조회
  async getUserProfile(userId: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`${this.basePath}/${userId}/profile`);
  }

  // 사용자명으로 프로필 조회
  async getUserProfileByUsername(username: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(
      `${this.basePath}/username/${username}/profile`,
    );
  }

  // 프로필 업데이트
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.username) formData.append("username", data.username);
    if (data.bio) formData.append("bio", data.bio);
    if (data.avatar) formData.append("avatar", data.avatar);

    return apiClient.put<User>(`${this.basePath}/profile`, formData);
  }

  // 사용자 통계 조회
  async getUserStats(userId: string): Promise<UserStats> {
    return apiClient.get<UserStats>(`${this.basePath}/${userId}/stats`);
  }

  // 사용자 활동 기록 조회
  async getUserActivity(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<UserActivity[]> {
    const params = { page, limit };
    return apiClient.get<UserActivity[]>(
      `${this.basePath}/${userId}/activity`,
      params,
    );
  }

  // 사용자 뱃지 조회
  async getUserBadges(userId: string): Promise<Badge[]> {
    return apiClient.get<Badge[]>(`${this.basePath}/${userId}/badges`);
  }

  // 사용자 검색
  async searchUsers(
    query: string,
    page?: number,
    limit?: number,
  ): Promise<UserProfile[]> {
    const params = { search: query, page, limit };
    return apiClient.get<UserProfile[]>(`${this.basePath}/search`, params);
  }

  // 활성 사용자 목록 조회
  async getActiveUsers(
    period?: "daily" | "weekly" | "monthly",
    limit?: number,
  ): Promise<UserProfile[]> {
    const params = { period, limit };
    return apiClient.get<UserProfile[]>(`${this.basePath}/active`, params);
  }

  // 신규 사용자 목록 조회
  async getNewUsers(limit?: number): Promise<UserProfile[]> {
    return apiClient.get<UserProfile[]>(`${this.basePath}/new`, { limit });
  }

  // 사용자 차단
  async blockUser(userId: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/${userId}/block`);
  }

  // 사용자 차단 해제
  async unblockUser(userId: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${userId}/block`);
  }

  // 차단된 사용자 목록 조회
  async getBlockedUsers(): Promise<UserProfile[]> {
    return apiClient.get<UserProfile[]>(`${this.basePath}/blocked`);
  }

  // 사용자 팔로우
  async followUser(userId: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/${userId}/follow`);
  }

  // 사용자 언팔로우
  async unfollowUser(userId: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${userId}/follow`);
  }

  // 팔로워 목록 조회
  async getFollowers(userId: string): Promise<UserProfile[]> {
    return apiClient.get<UserProfile[]>(`${this.basePath}/${userId}/followers`);
  }

  // 팔로잉 목록 조회
  async getFollowing(userId: string): Promise<UserProfile[]> {
    return apiClient.get<UserProfile[]>(`${this.basePath}/${userId}/following`);
  }

  // 계정 삭제
  async deleteAccount(): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/account`);
  }

  // 사용자명 중복 확인
  async checkUsernameAvailability(
    username: string,
  ): Promise<{ available: boolean }> {
    return apiClient.get<{ available: boolean }>(
      `${this.basePath}/check-username`,
      { username },
    );
  }
}

// API 인스턴스 생성 및 내보내기
export const usersApi = new UsersApi();
