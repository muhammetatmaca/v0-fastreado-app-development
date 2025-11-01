"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PdfBionicViewer } from "@/components/pdf-bionic-viewer"



export default function BionicReaderPage() {
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
                <p className="text-sm text-muted-foreground">Bionic Okuma</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {driveFileId ? (
          <PdfBionicViewer 
            driveFileId={driveFileId}
            title={pdfTitle}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">PDF Bulunamadı</h2>
            <p className="text-muted-foreground mb-6">
              Bu PDF dosyasına erişilemiyor. Lütfen başka bir PDF deneyin.
            </p>
            <Link href="/library">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kütüphaneye Dön
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}