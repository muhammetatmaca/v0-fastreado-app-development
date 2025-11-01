"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"

export default function ResetPasswordPage() {
  const { language } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [token, setToken] = useState("")

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError(language === 'tr' ? 'Geçersiz sıfırlama bağlantısı' : 'Invalid reset link')
    }
  }, [searchParams, language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError(language === 'tr' ? 'Şifreler eşleşmiyor' : 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError(language === 'tr' ? 'Şifre en az 6 karakter olmalıdır' : 'Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.error || (language === 'tr' ? 'Bir hata oluştu' : 'An error occurred'))
      }
    } catch (error) {
      setError(language === 'tr' ? 'Bağlantı hatası' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <img src="/fastreado-logo.png" alt="Fastreado" className="h-12 w-auto mx-auto logo-img" />
            </Link>
            <LanguageFlags />
          </div>

          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              {language === 'tr' ? 'Şifre Sıfırlandı!' : 'Password Reset!'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {language === 'tr' 
                ? 'Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...'
                : 'Your password has been successfully reset. Redirecting to login page...'
              }
            </p>
            <Link href="/login">
              <Button className="w-full">
                {language === 'tr' ? 'Giriş Yap' : 'Login'}
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <img src="/fastreado-logo.png" alt="Fastreado" className="h-12 w-auto mx-auto logo-img" />
          </Link>
          <LanguageFlags />
        </div>

        <Card className="p-8">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              {language === 'tr' ? 'Yeni Şifre Oluştur' : 'Create New Password'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'tr' 
                ? 'Hesabınız için yeni bir şifre oluşturun.'
                : 'Create a new password for your account.'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">
                {language === 'tr' ? 'Yeni Şifre' : 'New Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={language === 'tr' ? 'En az 6 karakter' : 'At least 6 characters'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">
                {language === 'tr' ? 'Şifre Tekrar' : 'Confirm Password'}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={language === 'tr' ? 'Şifrenizi tekrar girin' : 'Enter your password again'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !token}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {language === 'tr' ? 'Sıfırlanıyor...' : 'Resetting...'}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  {language === 'tr' ? 'Şifreyi Sıfırla' : 'Reset Password'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
              {language === 'tr' ? 'Giriş sayfasına dön' : 'Back to login'}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}