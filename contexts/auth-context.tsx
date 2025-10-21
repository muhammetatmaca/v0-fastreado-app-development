"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = await authService.login(email, password)
    if (loggedInUser) {
      setUser(loggedInUser)
      return true
    }
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    const newUser = await authService.signup(email, password, name)
    if (newUser) {
      setUser(newUser)
      return true
    }
    return false
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    router.push("/")
  }

  const updateUser = (updates: Partial<User>) => {
    const updatedUser = authService.updateUser(updates)
    if (updatedUser) {
      setUser(updatedUser)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
