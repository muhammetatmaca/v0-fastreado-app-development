"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AccountPage() {
  // Mock user data - will be replaced with real auth
  const [user] = useState({
    email: "kullanici@example.com",
    plan: "free", // 'free' or 'premium'
    pdfCount: 1,
    pdfLimit: 2,
    joinDate: "2025-01-15",
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/library" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Fastreado</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Kütüphaneye Dön
        </Link>

        <h1 className="text-4xl font-bold mb-8">Hesap Ayarları</h1>

        <div className="space-y-6">
          {/* Account Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Hesap Bilgileri</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">E-posta</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Üyelik Tarihi</p>
                <p className="font-medium">
                  {new Date(user.joinDate).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </Card>

          {/* Subscription Info */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Abonelik Planı</h2>
                <div className="flex items-center gap-2">
                  {user.plan === "premium" ? (
                    <>
                      <Crown className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary">Premium</span>
                    </>
                  ) : (
                    <span className="font-semibold">Ücretsiz</span>
                  )}
                </div>
              </div>
              {user.plan === "free" && (
                <Button asChild>
                  <Link href="/checkout/premium">Premium'a Geç</Link>
                </Button>
              )}
            </div>

            {user.plan === "free" ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Bu Ay Kullanılan PDF</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(user.pdfCount / user.pdfLimit) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {user.pdfCount}/{user.pdfLimit}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Premium'a geçerek sınırsız PDF ve AI özellikleri kazanın.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Sınırsız PDF yükleme ve AI özelliklerinin keyfini çıkarıyorsunuz.
                </p>
                <Button variant="outline" size="sm">
                  Aboneliği Yönet
                </Button>
              </div>
            )}
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/50">
            <h2 className="text-xl font-semibold mb-4 text-destructive">Tehlikeli Bölge</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Hesabınızı silmek geri alınamaz bir işlemdir. Tüm PDF'leriniz ve verileriniz kalıcı olarak silinecektir.
            </p>
            <Button variant="destructive" size="sm">
              Hesabı Sil
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
