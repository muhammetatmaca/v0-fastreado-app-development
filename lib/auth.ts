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
  verify: '/api/auth/verify',
  resend: '/api/auth/resend',
  logout: '/api/auth/logout'
}

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    const res = await fetch(API.login, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await res.json()
    if (!res.ok) {
      // surface verification required state
      if (data && data.verificationRequired) {
        throw new Error('verification_required')
      }
      return null
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
      return data.user
    }
    return null
  },

  signup: async (email: string, password: string, name: string): Promise<User | null> => {
    const res = await fetch(API.signup, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) })
    const data = await res.json()
    if (!res.ok) return null
    if (data.user) {
      // note: user must verify email before login
      return data.user
    }
    return null
  },

  verify: async (email: string, code: string) => {
    const res = await fetch(API.verify, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code }) })
    return res.ok
  },

  resend: async (email: string) => {
    const res = await fetch(API.resend, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    return res.ok
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
