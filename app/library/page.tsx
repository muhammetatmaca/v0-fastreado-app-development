"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, BookOpen, FileText, Trash2, Play, LogOut, User } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"
import Link from "next/link"
import { AIFeaturesDialog } from "@/components/ai-features-dialog"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PDF {
  id: string
  title: string
  coverUrl: string
  pageCount: number
  uploadDate: string
  progress: number
  isUserUploaded?: boolean // Kullanıcının yüklediği PDF'ler için
}

export default function LibraryPage() {
  const { user, logout, isLoading, updateUser } = useAuth()
  const { t, isLoading: translationLoading } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Handle user data from Google OAuth or refresh user data
  useEffect(() => {
    const handleUserData = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' })
        if (response.ok) {
          const userData = await response.json()
          if (userData.user) {
            // Update user in context and localStorage
            localStorage.setItem('user', JSON.stringify(userData.user))
            updateUser(userData.user)
          }
        } else if (response.status === 401) {
          // Token invalid, redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }

    // Only fetch if we don't have user data or if we just landed from OAuth
    if (!user && !isLoading) {
      handleUserData()
    }
  }, [user, isLoading, updateUser, router])

  const [pdfs, setPdfs] = useState<PDF[]>([
    {
      id: "1",
      title: "Nutuk - Mustafa Kemal Atatürk",
      coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      pageCount: 542,
      uploadDate: "2024-01-15",
      progress: 0,
      isUserUploaded: false,
    },
    {
      id: "2",
      title: "Safahat - Mehmet Akif Ersoy",
      coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      pageCount: 324,
      uploadDate: "2024-01-14",
      progress: 25,
      isUserUploaded: false,
    },
    {
      id: "3",
      title: "Kuyucaklı Yusuf - Sabahattin Ali",
      coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      pageCount: 198,
      uploadDate: "2024-01-13",
      progress: 60,
      isUserUploaded: false,
    },
    {
      id: "4",
      title: "İçimizdeki Şeytan - Sabahattin Ali",
      coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      pageCount: 156,
      uploadDate: "2024-01-12",
      progress: 100,
      isUserUploaded: false,
    },
    {
      id: "5",
      title: "Sinekli Bakkal - Halide Edib Adıvar",
      coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      pageCount: 287,
      uploadDate: "2024-01-11",
      progress: 0,
      isUserUploaded: false,
    },
    {
      id: "6",
      title: "Çalıkuşu - Reşat Nuri Güntekin",
      coverUrl: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=600&fit=crop",
      pageCount: 342,
      uploadDate: "2024-01-10",
      progress: 35,
      isUserUploaded: false,
    },
    {
      id: "7",
      title: "Aşk-ı Memnu - Halit Ziya Uşaklıgil",
      coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      pageCount: 456,
      uploadDate: "2024-01-09",
      progress: 80,
      isUserUploaded: false,
    },
    {
      id: "8",
      title: "Tutunamayanlar - Oğuz Atay",
      coverUrl: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=600&fit=crop",
      pageCount: 724,
      uploadDate: "2024-01-08",
      progress: 15,
      isUserUploaded: false,
    },
    {
      id: "9",
      title: "Beyaz Kale - Orhan Pamuk",
      coverUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
      pageCount: 198,
      uploadDate: "2024-01-07",
      progress: 90,
      isUserUploaded: false,
    },
    {
      id: "10",
      title: "Sevgili Arsız Ölüm - Nazim Hikmet",
      coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
      pageCount: 234,
      uploadDate: "2024-01-06",
      progress: 45,
      isUserUploaded: false,
    },
  ])
  const [isUploading, setIsUploading] = useState(false)

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img src="/fastreado-logo.png" alt="Fastreado" className="h-14 w-auto mx-auto mb-4 animate-pulse logo-img" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== "application/pdf") return

    if (!canUpload) {
      alert(`Ücretsiz planda maksimum ${maxPdfs} PDF yükleyebilirsiniz. Premium'a geçerek sınırsız PDF yükleyin.`)
      return
    }

    setIsUploading(true)

    setTimeout(() => {
      const newPdf: PDF = {
        id: Date.now().toString(),
        title: file.name.replace(".pdf", ""),
        coverUrl: "/abstract-book-cover.png",
        pageCount: Math.floor(Math.random() * 400) + 100,
        uploadDate: new Date().toISOString().split("T")[0],
        progress: 0,
        isUserUploaded: true, // Kullanıcının yüklediği PDF
      }
      setPdfs([newPdf, ...pdfs])
      setIsUploading(false)
    }, 1500)
  }

  const handleDelete = (id: string) => {
    setPdfs(pdfs.filter((pdf) => pdf.id !== id))
  }

  const maxPdfs = user.plan === "premium" ? Number.POSITIVE_INFINITY : 2
  const userUploadedPdfs = pdfs.filter(pdf => pdf.isUserUploaded)
  const canUpload = userUploadedPdfs.length < maxPdfs

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/fastreado-logo.png" alt="Fastreado" className="h-10 w-auto logo-img" />
            </Link>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageFlags />
              <span className="text-sm text-muted-foreground">
                {userUploadedPdfs.length} / {user.plan === "premium" ? "∞" : maxPdfs} PDF (
                {user.plan === "premium" ? t("library.premium") : t("library.free")})
              </span>
              {user.plan === "free" && (
                <Link href="/pricing">
                  <Button variant="outline" size="sm">
                    {t("library.upgrade_to_premium")}
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("library.my_account")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">{t("library.account_settings")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pricing">{t("library.subscription")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageFlags />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 px-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs truncate max-w-20">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("library.my_account")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">{t("library.account_settings")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pricing">{t("library.subscription")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Stats Bar */}
      <div className="md:hidden bg-card/50 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              {userUploadedPdfs.length} / {user.plan === "premium" ? "∞" : maxPdfs} PDF
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {user.plan === "premium" ? "Premium" : "Ücretsiz"}
              </div>
              {user.plan === "free" && (
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="text-xs h-6 px-2">
                    {t("library.upgrade")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("library.title")}</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">{t("library.subtitle")}</p>

          <label htmlFor="pdf-upload">
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer p-4 md:p-8 text-center">
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading || !canUpload}
              />
              <Upload className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-muted-foreground" />
              <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{isUploading ? t("library.uploading") : t("library.upload")}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {!canUpload
                  ? t("library.max_pdfs", { count: maxPdfs })
                  : t("library.click_or_drag")}
              </p>
            </Card>
          </label>
        </div>

        {pdfs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {pdfs.map((pdf) => (
              <Card key={pdf.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative aspect-[2/3] bg-muted overflow-hidden">
                  <img
                    src={pdf.coverUrl || "/placeholder.svg"}
                    alt={pdf.title}
                    className="w-full h-full object-cover"
                  />
                  {pdf.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                      <div className="h-full bg-primary transition-all" style={{ width: `${pdf.progress}%` }} />
                    </div>
                  )}
                </div>

                <div className="p-3 md:p-4">
                  <h3 className="font-semibold mb-1 truncate text-sm md:text-base">{pdf.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                    {pdf.pageCount} {t("library.pages")} • {pdf.progress > 0 ? `%${pdf.progress} ${t("library.completed")}` : t("library.not_started")}
                  </p>

                  <div className="mb-2 md:mb-3">
                    <AIFeaturesDialog pdfId={pdf.id} pdfTitle={pdf.title} />
                  </div>

                  {/* Desktop Buttons */}
                  <div className="hidden md:flex gap-2">
                    <Link href={`/read/rsvp/${pdf.id}`} className="flex-1">
                      <Button size="sm" className="w-full gap-2">
                        <Play className="w-4 h-4" />
                        RSVP
                      </Button>
                    </Link>
                    <Link href={`/read/bionic/${pdf.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full gap-2 bg-transparent">
                        <BookOpen className="w-4 h-4" />
                        Bionic
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(pdf.id)} className="px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Mobile Buttons */}
                  <div className="md:hidden space-y-2">
                    <div className="flex gap-2">
                      <Link href={`/read/rsvp/${pdf.id}`} className="flex-1">
                        <Button size="sm" className="w-full gap-1 text-xs">
                          <Play className="w-3 h-3" />
                          {t("library.rsvp_reading")}
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(pdf.id)} className="px-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Link href={`/read/bionic/${pdf.id}`} className="block">
                      <Button size="sm" variant="outline" className="w-full gap-1 bg-transparent text-xs">
                        <BookOpen className="w-3 h-3" />
                        {t("library.bionic_reading")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-muted-foreground" />
            <h3 className="text-lg md:text-xl font-semibold mb-2">{t("library.no_pdfs")}</h3>
            <p className="text-sm md:text-base text-muted-foreground">{t("library.upload_first")}</p>
          </div>
        )}
      </main>
    </div>
  )
}
