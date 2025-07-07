"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// 새로운 API와 타입 사용
import { api } from "@/apis";
import type { User, LoginRequest } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (provider: "google" | "kakao") => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 로드 시 현재 사용자 정보 확인
    const initializeAuth = async () => {
      try {
        const currentUser = await api.users.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // 인증되지 않은 상태 - 정상적인 경우
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (provider: "google" | "kakao") => {
    setLoading(true);
    try {
      const loginRequest: LoginRequest = { provider };
      const { user: userData } = await api.users.login(loginRequest);
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.users.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = await api.users.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
