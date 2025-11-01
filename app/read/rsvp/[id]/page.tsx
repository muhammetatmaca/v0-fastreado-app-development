"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getGoogleDriveEmbedUrl } from "@/lib/google-drive"

export default function RSVPReaderPage() {
  const params = useParams()
  const pdfId = params.id as string
  const [pdfTitle, setPdfTitle] = useState<string>("")
  const [pdfData, setPdfData] = useState<string | null>(null)
  const [driveFileId, setDriveFileId] = useState<string | null>(null)
  const [isGoogleDrivePdf, setIsGoogleDrivePdf] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const findPdf = async () => {
      setLoading(true)
      
      // Önce public books'ları API'den kontrol et
      if (pdfId.startsWith('public_')) {
        try {
          const response = await fetch('/api/public-books')
          const result = await response.json()
          
          if (result.success) {
            const publicPdf = result.books.find((p: any) => p.id === pdfId)
            if (publicPdf) {
              setPdfTitle(publicPdf.title)
              setDriveFileId(publicPdf.driveFileId)
              setIsGoogleDrivePdf(true)
              setLoading(false)
              return
            }
          }
        } catch (error) {
          console.error('Failed to fetch public books:', error)
        }
      }

      // Sonra kullanıcının yüklediği PDF'leri kontrol et
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.id) {
        const savedPdfs = localStorage.getItem(`user_pdfs_${user.id}`)
        if (savedPdfs) {
          const localPdfs = JSON.parse(savedPdfs)
          const localPdf = localPdfs.find((p: any) => p.id === pdfId)
          if (localPdf) {
            setPdfTitle(localPdf.title)
            setPdfData(localPdf.fileData)
            setIsGoogleDrivePdf(false)
            setLoading(false)
            return
          }
        }
      }
      
      setLoading(false)
    }

    findPdf()
  }, [pdfId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">PDF yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!pdfData && !driveFileId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold mb-2">PDF Bulunamadı</h2>
          <p className="text-muted-foreground mb-6">
            Bu PDF mevcut değil. Lütfen kütüphaneden başka bir PDF seçin.
          </p>
          <Link href="/library">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kütüphaneye Dön
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/library">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kütüphane
                </Button>
              </Link>
              <div>
                <h1 className="font-semibold truncate max-w-md">{pdfTitle}</h1>
                <p className="text-sm text-muted-foreground">RSVP Okuma</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            {isGoogleDrivePdf && driveFileId ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-center">RSVP Okuma Modu</h2>
                <p className="text-muted-foreground mb-6 text-center">
                  Google Drive'dan yüklenen PDF. Okuma deneyimi yakında eklenecek.
                </p>
                
                {/* Google Drive PDF Embed */}
                <div className="border rounded-lg overflow-hidden bg-muted/50 mb-6">
                  <iframe
                    src={getGoogleDriveEmbedUrl(driveFileId)}
                    width="100%"
                    height="600"
                    className="border-0"
                    title={pdfTitle}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    PDF: {pdfTitle}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/library">
                      <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kütüphaneye Dön
                      </Button>
                    </Link>
                    <a 
                      href={`https://drive.google.com/file/d/${driveFileId}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline">
                        Google Drive'da Aç
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">RSVP Okuma Modu</h2>
                <p className="text-muted-foreground mb-6">
                  Kullanıcı PDF'i yüklendi. RSVP okuma deneyimi yakında eklenecek.
                </p>
                
                <div className="border rounded-lg p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    PDF: {pdfTitle}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Dosya boyutu: {pdfData ? Math.round(pdfData.length / 1024) : 0} KB
                  </p>
                </div>
                
                <div className="mt-6">
                  <Link href="/library">
                    <Button variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kütüphaneye Dön
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}