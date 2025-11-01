"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"

export default function ForgotPasswordPage() {
  const { language } = useTranslation()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
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
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <img src="/fastreado-logo.png" alt="Fastreado" className="h-12 w-auto mx-auto logo-img" />
            </Link>
            <LanguageFlags />
          </div>

          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              {language === 'tr' ? 'E-posta Gönderildi!' : 'Email Sent!'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {language === 'tr' 
                ? 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. E-postanızı kontrol edin.'
                : 'A password reset link has been sent to your email address. Please check your email.'
              }
            </p>
            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full">
                  {language === 'tr' ? 'Giriş Sayfasına Dön' : 'Back to Login'}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsSuccess(false)
                  setEmail("")
                }}
              >
                {language === 'tr' ? 'Tekrar Gönder' : 'Send Again'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <img src="/fastreado-logo.png" alt="Fastreado" className="h-12 w-auto mx-auto logo-img" />
          </Link>
          <LanguageFlags />
        </div>

        <Card className="p-8">
          <div className="text-center mb-6">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              {language === 'tr' ? 'Şifremi Unuttum' : 'Forgot Password'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'tr' 
                ? 'E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.'
                : 'Enter your email address and we\'ll send you a password reset link.'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">
                {language === 'tr' ? 'E-posta Adresi' : 'Email Address'}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={language === 'tr' ? 'ornek@email.com' : 'example@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {language === 'tr' ? 'Gönderiliyor...' : 'Sending...'}
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  {language === 'tr' ? 'Sıfırlama Bağlantısı Gönder' : 'Send Reset Link'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {language === 'tr' ? 'Giriş sayfasına dön' : 'Back to login'}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}