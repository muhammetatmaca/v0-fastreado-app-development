"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"

export default function VerifyPage() {
    const [code, setCode] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const { verify, resend } = useAuth()
    const { t, isLoading: translationLoading } = useTranslation()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const emailParam = searchParams.get('email')
        if (emailParam) {
            setEmail(emailParam)
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !code) {
            setError("E-posta ve doğrulama kodu gerekli")
            return
        }

        setError("")
        setIsLoading(true)

        const success = await verify(email, code)

        if (success) {
            setSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } else {
            setError(t("verify.invalid_code"))
        }

        setIsLoading(false)
    }

    const handleResend = async () => {
        if (!email) {
            setError("E-posta adresi gerekli")
            return
        }

        setIsResending(true)
        setError("")

        const success = await resend(email)

        if (success) {
            setError("")
            // Show success message temporarily
            const originalError = error
            setError(t("verify.code_sent"))
            setTimeout(() => setError(originalError), 3000)
        } else {
            setError("Doğrulama kodu gönderilemedi")
        }

        setIsResending(false)
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

    if (success) {
        return (
            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex-1"></div>
                        <Link href="/" className="inline-flex items-center gap-2">
                            <img src="/fastreado-logo.png" alt="Fastreado" className="h-16 w-auto logo-img" />
                        </Link>
                        <div className="flex-1 flex justify-end">
                            <LanguageFlags />
                        </div>
                    </div>
                </header>

                <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
                    <div className="w-full max-w-md text-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">{t("verify.success")}</h1>
                        <p className="text-muted-foreground mb-4">
                            {t("verify.success_subtitle")}
                        </p>
                    </div>
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
                        <img src="/fastreado-logo.png" alt="Fastreado" className="h-16 w-auto logo-img" />
                    </Link>
                    <div className="flex-1 flex justify-end">
                        <LanguageFlags />
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">{t("verify.title")}</h1>
                        <p className="text-muted-foreground">
                            {t("verify.subtitle")}
                        </p>
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
                                <Label htmlFor="code">{t("verify.code")}</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="123456"
                                    required
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>

                            {error && (
                                <p className={`text-sm ${error.includes('gönderildi') || error.includes('sent') ? 'text-green-600' : 'text-red-500'}`}>
                                    {error}
                                </p>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? t("verify.verifying") : t("verify.verify")}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                Doğrulama kodu almadınız mı?
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleResend}
                                disabled={isResending || !email}
                                className="w-full"
                            >
                                {isResending ? t("verify.resending") : t("verify.resend")}
                            </Button>
                        </div>

                        <div className="mt-6 text-center text-sm">
                            <Link href="/login" className="text-primary hover:underline">
                                {t("verify.back_to_login")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}