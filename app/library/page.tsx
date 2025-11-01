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
import { GOOGLE_DRIVE_PUBLIC_BOOKS } from "@/lib/google-drive"
import { getUserDrivePdfs } from "@/lib/user-drive-upload"
import { BookCover } from "@/components/book-cover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"

interface PDF {
  id: string
  title: string
  coverUrl: string
  pageCount: number
  uploadDate: string
  progress: number
  isUserUploaded?: boolean // Kullanıcının yüklediği PDF'ler için
  fileData?: string // Base64 encoded PDF data (localStorage için)
  driveFileId?: string // Google Drive file ID
  description?: string // PDF açıklaması
  isPublicBook?: boolean // Genel kitap mı kullanıcı kitabı mı
  userId?: string // Hangi kullanıcının kitabı
  language?: 'tr' | 'en' // Kitap dili (sadece public books için)
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

  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [publicBooks, setPublicBooks] = useState<PDF[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingBooks, setIsLoadingBooks] = useState(true)
  const [languageFilter, setLanguageFilter] = useState<'all' | 'tr' | 'en'>('all')
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; pdfId: string; pdfTitle: string }>({
    open: false,
    pdfId: '',
    pdfTitle: ''
  })

  // Load public books from API
  useEffect(() => {
    const fetchPublicBooks = async () => {
      try {
        setIsLoadingBooks(true)
        const response = await fetch('/api/public-books')
        const result = await response.json()
        
        if (result.success) {
          setPublicBooks(result.books)
        } else {
          console.error('Failed to fetch public books:', result.error)
          // Fallback to static books if API fails
          setPublicBooks(GOOGLE_DRIVE_PUBLIC_BOOKS)
        }
      } catch (error) {
        console.error('Public books fetch error:', error)
        // Fallback to static books if API fails
        setPublicBooks(GOOGLE_DRIVE_PUBLIC_BOOKS)
      } finally {
        setIsLoadingBooks(false)
      }
    }

    fetchPublicBooks()
  }, [])

  // Load PDFs from localStorage on component mount
  useEffect(() => {
    if (user && !isLoadingBooks) {
      const savedPdfs = localStorage.getItem(`user_pdfs_${user.id}`)
      const userPdfs = savedPdfs ? JSON.parse(savedPdfs) : []
      
      // Load progress from localStorage
      const savedProgress = localStorage.getItem(`pdf_progress_${user.id}`)
      const progressData = savedProgress ? JSON.parse(savedProgress) : {}
      
      // Merge Google Drive books with user uploads and apply saved progress
      const allPdfs = [...publicBooks.map(book => ({
        ...book,
        progress: progressData[book.id] || book.progress
      })), ...userPdfs]
      
      setPdfs(allPdfs)
    }
  }, [user, publicBooks, isLoadingBooks])

  // Save user PDFs to localStorage whenever pdfs change
  useEffect(() => {
    if (user && pdfs.length > 0) {
      const userPdfs = pdfs.filter(pdf => pdf.isUserUploaded)
      localStorage.setItem(`user_pdfs_${user.id}`, JSON.stringify(userPdfs))
      
      // Save progress for all PDFs
      const progressData: Record<string, number> = {}
      pdfs.forEach(pdf => {
        progressData[pdf.id] = pdf.progress
      })
      localStorage.setItem(`pdf_progress_${user.id}`, JSON.stringify(progressData))
    }
  }, [pdfs, user])

  if (isLoading || !user || isLoadingBooks) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img src="/fastreado-logo.png" alt="Fastreado" className="h-14 w-auto mx-auto mb-4 animate-pulse logo-img" />
          <p className="text-muted-foreground">
            {isLoadingBooks ? "Kitaplar yükleniyor..." : t("common.loading")}
          </p>
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

    try {
      // Convert PDF to base64 for local storage
      const reader = new FileReader()
      reader.onload = (event) => {
        const fileData = event.target?.result as string
        
        const newPdf: PDF = {
          id: Date.now().toString(),
          title: file.name.replace(".pdf", ""),
          coverUrl: "/abstract-book-cover.png",
          pageCount: Math.floor(Math.random() * 400) + 100,
          uploadDate: new Date().toISOString().split("T")[0],
          progress: 0,
          isUserUploaded: true,
          fileData: fileData // Store base64 data
        }
        
        setPdfs(prevPdfs => [newPdf, ...prevPdfs])
        setIsUploading(false)
      }
      
      reader.onerror = () => {
        setIsUploading(false)
        alert('PDF yüklenirken hata oluştu. Lütfen tekrar deneyin.')
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      setIsUploading(false)
      alert('PDF yüklenirken hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteDialog({ open: true, pdfId: id, pdfTitle: title })
  }

  const handleDeleteConfirm = () => {
    setPdfs(prevPdfs => prevPdfs.filter((pdf) => pdf.id !== deleteDialog.pdfId))
    setDeleteDialog({ open: false, pdfId: '', pdfTitle: '' })
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, pdfId: '', pdfTitle: '' })
  }

  const maxPdfs = user.plan === "premium" ? Number.POSITIVE_INFINITY : 2
  const userUploadedPdfs = pdfs.filter(pdf => pdf.isUserUploaded)
  const canUpload = userUploadedPdfs.length < maxPdfs

  // Dil filtresine göre PDF'leri filtrele
  const filteredPdfs = pdfs.filter(pdf => {
    if (languageFilter === 'all') return true
    if (pdf.isUserUploaded) return true // Kullanıcı PDF'leri her zaman göster
    return pdf.language === languageFilter
  })

  // İstatistikler
  const turkishBooksCount = publicBooks.filter(book => book.language === 'tr').length
  const englishBooksCount = publicBooks.filter(book => book.language === 'en').length

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

          {/* Dil Filtresi */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-medium text-muted-foreground">Dil:</span>
            <div className="flex gap-2">
              <Button
                variant={languageFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguageFilter('all')}
                className="text-xs"
              >
                Tümü ({publicBooks.length + userUploadedPdfs.length})
              </Button>
              <Button
                variant={languageFilter === 'tr' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguageFilter('tr')}
                className="text-xs"
              >
                🇹🇷 Türkçe ({turkishBooksCount + userUploadedPdfs.length})
              </Button>
              <Button
                variant={languageFilter === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguageFilter('en')}
                className="text-xs"
              >
                🇬🇧 English ({englishBooksCount})
              </Button>
            </div>
          </div>

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

        {filteredPdfs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredPdfs.map((pdf) => (
              <Card key={pdf.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <BookCover 
                    title={pdf.title}
                    language={pdf.language}
                    isUserUploaded={pdf.isUserUploaded}
                  />
                  
                  {/* Progress bar */}
                  {pdf.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                      <div className="h-full bg-white/80 transition-all" style={{ width: `${pdf.progress}%` }} />
                    </div>
                  )}
                </div>

                <div className="p-3 md:p-4">
                  <h3 className="font-semibold mb-1 text-sm md:text-base line-clamp-2 leading-tight" title={pdf.title}>
                    {pdf.title}
                  </h3>
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
                    {pdf.isUserUploaded && (
                      <Button size="sm" variant="outline" onClick={() => handleDeleteClick(pdf.id, pdf.title)} className="px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
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
                      {pdf.isUserUploaded && (
                        <Button size="sm" variant="outline" onClick={() => handleDeleteClick(pdf.id, pdf.title)} className="px-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open: boolean) => !open && handleDeleteCancel()}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white text-xl font-bold">
              {t("library.delete_pdf_title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-white">"{deleteDialog.pdfTitle}"</span> {t("library.delete_pdf_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 pt-4">
            <AlertDialogCancel 
              onClick={handleDeleteCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300 font-medium"
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-red-600 hover:bg-red-700 text-white border-red-600 font-medium"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
