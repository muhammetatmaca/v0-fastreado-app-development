"use client"

export interface User {
  id: string
  email: string
  name: string
  plan: "free" | "premium"
  pdfCount: number
  maxPdfs: number
}

const ADMIN_EMAIL = "admin@gmail.com"
const ADMIN_PASSWORD = "123456"

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  [ADMIN_EMAIL]: {
    password: ADMIN_PASSWORD,
    user: {
      id: "admin-1",
      email: ADMIN_EMAIL,
      name: "Admin",
      plan: "premium",
      pdfCount: 0,
      maxPdfs: Number.POSITIVE_INFINITY,
    },
  },
}

export const authService = {
  login: (email: string, password: string): User | null => {
    const userRecord = MOCK_USERS[email]
    if (userRecord && userRecord.password === password) {
      localStorage.setItem("user", JSON.stringify(userRecord.user))
      return userRecord.user
    }
    return null
  },

  signup: (email: string, password: string, name: string): User | null => {
    if (MOCK_USERS[email]) {
      return null // User already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      plan: "free",
      pdfCount: 0,
      maxPdfs: 2,
    }

    MOCK_USERS[email] = { password, user: newUser }
    localStorage.setItem("user", JSON.stringify(newUser))
    return newUser
  },

  logout: () => {
    localStorage.removeItem("user")
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) return null

    const updatedUser = { ...currentUser, ...updates }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    return updatedUser
  },
}
