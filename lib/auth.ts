"use client"

export interface User {
  id: string
  email: string
  name: string
  plan?: "free" | "premium"
  pdfCount?: number
  maxPdfs?: number
}

const API = {
  login: '/api/auth/login',
  signup: '/api/auth/signup',
  logout: '/api/auth/logout'
}

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    const res = await fetch(API.login, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (!res.ok) return null
    const data = await res.json()
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
      return data.user
    }
    return null
  },

  signup: async (email: string, password: string, name: string): Promise<User | null> => {
    const res = await fetch(API.signup, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) })
    if (!res.ok) return null
    const data = await res.json()
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
      return data.user
    }
    return null
  },

  logout: async () => {
    await fetch(API.logout, { method: 'POST' })
    localStorage.removeItem('user')
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  updateUser: (_updates: Partial<User>) => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) return null
    const updatedUser = { ...currentUser, ..._updates }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    return updatedUser
  }
}
