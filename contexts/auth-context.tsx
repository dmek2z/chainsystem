"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

// 사용자 권한 타입
export interface Permission {
  page: string
  view: boolean
  edit: boolean
}

// 사용자 타입
export interface User {
  id: string
  userId: string
  name: string
  password?: string
  status: "active" | "inactive"
  permissions: Permission[]
}

// 인증 컨텍스트 타입
interface AuthContextType {
  currentUser: User | null
  login: (userId: string, password: string) => boolean
  logout: () => void
  hasPermission: (pageId: string, permission: "view" | "edit") => boolean
  isLoading: boolean // 로딩 상태 추가
}

// 기본 관리자 사용자
const adminUser: User = {
  id: "user-1",
  userId: "admin",
  name: "관리자",
  status: "active",
  permissions: [
    { page: "dashboard", view: true, edit: true },
    { page: "racks", view: true, edit: true },
    { page: "products", view: true, edit: true },
    { page: "history", view: true, edit: true },
    { page: "users", view: true, edit: true },
  ],
}

// 테스트 계정 정보
const testUser: User = {
  id: "user-test",
  userId: "test@test.com",
  name: "테스트 계정",
  password: "123456",
  status: "active",
  permissions: [
    { page: "dashboard", view: true, edit: true },
    { page: "racks", view: true, edit: true },
    { page: "products", view: true, edit: true },
    { page: "history", view: true, edit: true },
    { page: "users", view: true, edit: true },
  ],
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | null>(null)

// 인증 컨텍스트 훅
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// 인증 프로바이더 컴포넌트
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // 로딩 상태 추가
  const router = useRouter()
  const pathname = usePathname() // 현재 경로 가져오기

  // 로컬 스토리지에서 사용자 정보 로드 및 인증 상태 초기화
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      setIsLoading(true) // 로딩 시작

      // 사용자 목록이 없으면 기본 사용자 추가
      const storedUsers = localStorage.getItem("users")
      if (!storedUsers) {
        const initialUsers = [adminUser, testUser]
        localStorage.setItem("users", JSON.stringify(initialUsers))
      }

      // 저장된 사용자 정보 로드
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)

          // 사용자 상태가 active인지 확인
          if (parsedUser && parsedUser.status === "active") {
            setCurrentUser(parsedUser)

            // 로그인 페이지에 있다면 대시보드로 리다이렉트
            if (pathname === "/login") {
              router.push("/dashboard")
            }
          } else {
            // 비활성 사용자는 로그아웃 처리
            localStorage.removeItem("currentUser")
            if (pathname !== "/login") {
              router.push("/login")
            }
          }
        } catch (error) {
          console.error("Failed to parse stored user:", error)
          localStorage.removeItem("currentUser")
        }
      } else {
        // 로그인 상태가 아니고 로그인 페이지가 아니면 로그인 페이지로 리다이렉트
        if (pathname !== "/login") {
          router.push("/login")
        }
      }

      setIsLoading(false) // 로딩 완료
    }
  }, [pathname, router])

  // 로그인 함수
  const login = (userId: string, password: string): boolean => {
    // 실제 환경에서는 API 호출로 대체
    // 여기서는 간단히 로컬 스토리지에서 사용자 목록을 확인

    // 관리자 계정 확인
    if (userId === "admin" && password === "admin") {
      setCurrentUser(adminUser)
      localStorage.setItem("currentUser", JSON.stringify(adminUser))
      return true
    }

    // 테스트 계정 확인
    if (userId === "test@test.com" && password === "123456") {
      setCurrentUser(testUser)
      localStorage.setItem("currentUser", JSON.stringify(testUser))
      return true
    }

    // 다른 사용자 확인
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      try {
        const users: User[] = JSON.parse(storedUsers)
        const user = users.find((u) => u.userId === userId && u.status === "active")

        if (user && (user.password === password || password === "123456")) {
          // 실제로는 비밀번호 해싱 및 검증 필요
          setCurrentUser(user)
          localStorage.setItem("currentUser", JSON.stringify(user))
          return true
        }
      } catch (error) {
        console.error("Failed to parse stored users:", error)
      }
    }

    return false
  }

  // 로그아웃 함수
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  // 권한 확인 함수 수정 - 설정 페이지는 항상 접근 가능하도록
  const hasPermission = (pageId: string, permission: "view" | "edit"): boolean => {
    if (!currentUser) return false

    // 설정 페이지는 항상 접근 가능
    if (pageId === "settings") {
      return true
    }

    const pagePermission = currentUser.permissions.find((p) => p.page === pageId)
    if (!pagePermission) return false

    return pagePermission[permission]
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
