"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, BookOpen, Zap, FileText, Trash2, Play, LogOut, User } from "lucide-react"
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
}

export default function LibraryPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const [pdfs, setPdfs] = useState<PDF[]>([
    {
      id: "1",
      title: "Atomic Habits",
      coverUrl: "/atomic-habits-cover.png",
      pageCount: 320,
      uploadDate: "2024-01-15",
      progress: 45,
    },
    {
      id: "2",
      title: "Deep Work",
      coverUrl: "/deep-work-book-cover.jpg",
      pageCount: 296,
      uploadDate: "2024-01-10",
      progress: 100,
    },
  ])
  const [isUploading, setIsUploading] = useState(false)

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Yükleniyor...</p>
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
      }
      setPdfs([newPdf, ...pdfs])
      setIsUploading(false)
    }, 1500)
  }

  const handleDelete = (id: string) => {
    setPdfs(pdfs.filter((pdf) => pdf.id !== id))
  }

  const maxPdfs = user.plan === "premium" ? Number.POSITIVE_INFINITY : 2
  const canUpload = pdfs.length < maxPdfs

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Fastreado</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {pdfs.length} / {user.plan === "premium" ? "∞" : maxPdfs} PDF (
                {user.plan === "premium" ? "Premium" : "Ücretsiz"})
              </span>
              {user.plan === "free" && (
                <Link href="/pricing">
                  <Button variant="outline" size="sm">
                    Premium'a Geç
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
                  <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Hesap Ayarları</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pricing">Abonelik</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kütüphanem</h1>
          <p className="text-muted-foreground mb-6">PDF'lerinizi yükleyin ve hızlı okuma deneyimine başlayın</p>

          <label htmlFor="pdf-upload">
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer p-8 text-center">
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading || !canUpload}
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">{isUploading ? "Yükleniyor..." : "PDF Yükle"}</h3>
              <p className="text-sm text-muted-foreground">
                {!canUpload
                  ? `Ücretsiz planda maksimum ${maxPdfs} PDF yükleyebilirsiniz`
                  : "Tıklayın veya sürükleyip bırakın"}
              </p>
            </Card>
          </label>
        </div>

        {pdfs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{pdf.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {pdf.pageCount} sayfa • {pdf.progress > 0 ? `%${pdf.progress} tamamlandı` : "Başlanmadı"}
                  </p>

                  <div className="mb-3">
                    <AIFeaturesDialog pdfId={pdf.id} pdfTitle={pdf.title} />
                  </div>

                  <div className="flex gap-2">
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
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(pdf.id)} className="px-3">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Henüz PDF yok</h3>
            <p className="text-muted-foreground">İlk PDF'nizi yükleyerek başlayın</p>
          </div>
        )}
      </main>
    </div>
  )
}
