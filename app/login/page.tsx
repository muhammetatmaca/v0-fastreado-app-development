"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, googleLogin } = useAuth()
  const { t, isLoading: translationLoading } = useTranslation()
  const router = useRouter()

  // Handle Google OAuth errors from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    
    if (errorParam) {
      switch (errorParam) {
        case 'google_auth_failed':
          setError('Google ile giriş başarısız oldu')
          break
        case 'google_not_configured':
          setError('Google girişi şu anda kullanılamıyor')
          break
        case 'google_token_failed':
          setError('Google doğrulama hatası')
          break
        case 'google_user_failed':
          setError('Google kullanıcı bilgileri alınamadı')
          break
        case 'google_server_error':
          setError('Sunucu hatası, lütfen tekrar deneyin')
          break
      }
      // Clean URL
      window.history.replaceState({}, '', '/login')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (success) {
        router.push("/library")
      } else {
        setError(t("auth.invalid_credentials"))
      }
    } catch (err: any) {
      if (err?.message === 'verification_required') {
        // Redirect to verification page
        router.push(`/verify?email=${encodeURIComponent(email)}`)
        return
      }
      setError(t("auth.invalid_credentials"))
    }

    setIsLoading(false)
  }

  if (translationLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img src="/fastreado-logo.png" alt="Fastreado" className="h-12 w-auto mx-auto mb-4 animate-pulse logo-img" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex-1"></div>
          <Link href="/" className="inline-flex items-center gap-2">
            <img src="/fastreado-logo.png" alt="Fastreado" className="h-14 w-auto logo-img" />
          </Link>
          <div className="flex-1 flex justify-end">
            <LanguageFlags />
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{t("auth.welcome_back")}</h1>
            <p className="text-muted-foreground">{t("auth.login_subtitle")}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    {t("auth.forgot_password")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("auth.logging_in") : t("auth.login")}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t("common.or")}</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={googleLogin}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t("auth.google_login")}
            </Button>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{t("auth.no_account")} </span>
              <Link href="/signup" className="text-primary hover:underline">
                {t("auth.signup")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}