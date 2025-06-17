"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  email: string
  name: string
  username: string
  avatar?: string
  provider: "google" | "kakao"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (provider: "google" | "kakao") => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock authentication functions - replace with real implementation
const mockLogin = async (provider: "google" | "kakao"): Promise<User> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const mockUsers = {
    google: {
      id: "google_123",
      email: "user@gmail.com",
      name: "John Doe",
      username: "johndoe_poet",
      avatar: "/placeholder.svg?height=40&width=40",
      provider: "google" as const,
      createdAt: new Date().toISOString(),
    },
    kakao: {
      id: "kakao_456",
      email: "user@kakao.com",
      name: "김문학",
      username: "literary_kim",
      avatar: "/placeholder.svg?height=40&width=40",
      provider: "kakao" as const,
      createdAt: new Date().toISOString(),
    },
  }

  return mockUsers[provider]
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("literary_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (provider: "google" | "kakao") => {
    setLoading(true)
    try {
      const userData = await mockLogin(provider)
      setUser(userData)
      localStorage.setItem("literary_user", JSON.stringify(userData))
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("literary_user")
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("literary_user", JSON.stringify(updatedUser))
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>{children}</AuthContext.Provider>
}
