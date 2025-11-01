"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PdfUpload } from '@/components/pdf-upload'
import { FileText, Trash2, ExternalLink, Calendar, HardDrive, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { BookCover } from '@/components/book-cover'

interface UserPdf {
  id: string
  title: string
  driveFileId?: string
  coverUrl?: string
  pageCount: number
  uploadDate: string
  progress: number
  fileName?: string
  fileSize?: number
  webViewLink?: string
  webContentLink?: string
}

export default function MyPdfsPage() {
  const [pdfs, setPdfs] = useState<UserPdf[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUserPdfs()
  }, [])

  const fetchUserPdfs = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/user-pdfs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'PDF\'ler getirilemedi')
      }

      setPdfs(result.pdfs)
    } catch (error) {
      console.error('Fetch PDFs error:', error)
      toast.error(error instanceof Error ? error.message : 'PDF\'ler getirilemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (newPdf: UserPdf) => {
    setPdfs(prev => [newPdf, ...prev])
    toast.success('PDF başarıyla eklendi!')
  }

  const handleDeletePdf = async (pdfId: string) => {
    if (!confirm('Bu PDF\'i silmek istediğinizden emin misiniz?')) {
      return
    }

    setDeleting(pdfId)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/user-pdfs?pdfId=${pdfId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'PDF silinemedi')
      }

      setPdfs(prev => prev.filter(pdf => pdf.id !== pdfId))
      toast.success('PDF başarıyla silindi')

    } catch (error) {
      console.error('Delete PDF error:', error)
      toast.error(error instanceof Error ? error.message : 'PDF silinemedi')
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Bilinmiyor'
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleReadPdf = (pdf: UserPdf) => {
    // Okuma sayfasına yönlendir
    router.push(`/read/bionic/${pdf.id}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PDF Kitaplarım</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kendi PDF kitaplarınızı yükleyin ve hızlı okuma deneyimi yaşayın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PDF Yükleme */}
        <div className="lg:col-span-1">
          <PdfUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* PDF Listesi */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Yüklenen PDF'ler ({pdfs.length})
              </CardTitle>
              <CardDescription>
                Google Drive'da güvenle saklanan PDF kitaplarınız
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pdfs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Henüz PDF yüklenmemiş</p>
                  <p className="text-sm text-gray-400">
                    Sol taraftaki yükleme alanını kullanarak ilk PDF'inizi ekleyin
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-16 h-20">
                          <BookCover 
                            title={pdf.title}
                            isUserUploaded={true}
                            className="w-full h-full"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{pdf.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {pdf.uploadDate}
                            </span>
                            <span>{pdf.pageCount} sayfa</span>
                            <span>{formatFileSize(pdf.fileSize)}</span>
                          </div>
                          {pdf.progress > 0 && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                %{pdf.progress} okundu
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Okuma butonu */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReadPdf(pdf)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Oku
                        </Button>

                        {/* Google Drive'da görüntüle */}
                        {pdf.webViewLink && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(pdf.webViewLink, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Sil butonu */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePdf(pdf.id)}
                          disabled={deleting === pdf.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deleting === pdf.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bilgi kartı */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Google Drive Entegrasyonu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Avantajlar:</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Dosyalarınız Google Drive'da güvenle saklanır</li>
                <li>• Sınırsız depolama alanı (Google Drive limitinize bağlı)</li>
                <li>• Tüm cihazlarınızdan erişim</li>
                <li>• Otomatik yedekleme</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Desteklenen Özellikler:</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• PDF dosya formatı</li>
                <li>• Maksimum 50MB dosya boyutu</li>
                <li>• Hızlı okuma (Bionic Reading)</li>
                <li>• RSVP okuma modu</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}