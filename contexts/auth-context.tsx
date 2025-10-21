"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  verify: (email: string, code: string) => Promise<boolean>
  resend: (email: string) => Promise<boolean>
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
    try {
      const loggedInUser = await authService.login(email, password)
      if (loggedInUser) {
        setUser(loggedInUser)
        return true
      }
      return false
    } catch (err: any) {
      if (err?.message === 'verification_required') {
        return false
      }
      return false
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    const newUser = await authService.signup(email, password, name)
    if (newUser) {
      // user created but must verify via email
      return true
    }
    return false
  }

  const verify = async (email: string, code: string) => {
    const ok = await authService.verify(email, code)
    return ok
  }

  const resend = async (email: string) => {
    const ok = await authService.resend(email)
    return ok
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
    <AuthContext.Provider value={{ user, login, signup, verify, resend, logout, updateUser, isLoading }}>
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
