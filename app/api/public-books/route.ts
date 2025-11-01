import { NextResponse } from 'next/server'
import { listFilesInFolder } from '@/lib/google-drive-api'

export async function GET() {
  try {
    const publicBooksFolder = process.env.GOOGLE_DRIVE_PUBLIC_BOOKS_FOLDER_ID

    if (!publicBooksFolder) {
      return NextResponse.json({
        success: false,
        error: 'Public books folder not configured'
      }, { status: 500 })
    }

    // Public books klasöründeki dosyaları listele
    const result = await listFilesInFolder(publicBooksFolder)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

    // Dil tespiti fonksiyonu
    const detectLanguage = (title: string): 'tr' | 'en' => {
      const turkishWords = [
        'savaş', 'sanatı', 'küçük', 'prens', 'beyaz', 'zambaklar', 'ülkesinde', 
        'insan', 'yaşar', 'çalıkuşu', 'gulyabani', 'ile', 'ne', 'bir', 've',
        'atatürk', 'nutuk', 'safahat', 'kuyucaklı', 'yusuf', 'içimizdeki', 
        'şeytan', 'sinekli', 'bakkal', 'türk', 'türkiye', 'istanbul', 'ankara'
      ]
      
      const englishWords = [
        'the', 'and', 'of', 'to', 'a', 'in', 'for', 'is', 'on', 'that', 'by',
        'this', 'with', 'i', 'you', 'it', 'not', 'or', 'be', 'are', 'from',
        'at', 'as', 'your', 'all', 'any', 'can', 'had', 'her', 'was', 'one',
        'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new',
        'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let',
        'put', 'say', 'she', 'too', 'use', 'conte', 'montecristo', 'alexandre',
        'dumas', 'stefan', 'zweig', 'post', 'office', 'girl', 'letter', 'unknown',
        'woman', 'journey', 'past', 'antoine', 'saint', 'exupery'
      ]
      
      const lowerTitle = title.toLowerCase()
      
      let turkishScore = 0
      let englishScore = 0
      
      turkishWords.forEach(word => {
        if (lowerTitle.includes(word)) turkishScore++
      })
      
      englishWords.forEach(word => {
        if (lowerTitle.includes(word)) englishScore++
      })
      
      // Özel durumlar
      if (lowerTitle.includes('sun tzu') || lowerTitle.includes('savaş sanatı')) return 'tr'
      if (lowerTitle.includes('küçük prens') || lowerTitle.includes('antoine')) return 'tr'
      if (lowerTitle.includes('stefan zweig') && (lowerTitle.includes('post') || lowerTitle.includes('letter') || lowerTitle.includes('journey'))) return 'en'
      if (lowerTitle.includes('conte') || lowerTitle.includes('montecristo')) return 'en'
      if (lowerTitle.includes('çalıkuşu') || lowerTitle.includes('gulyabani')) return 'tr'
      if (lowerTitle.includes('beyaz zambaklar') || lowerTitle.includes('grigory')) return 'tr'
      if (lowerTitle.includes('tolstoy') || lowerTitle.includes('yaşar')) return 'tr'
      
      return turkishScore >= englishScore ? 'tr' : 'en'
    }

    // PDF dosyalarını filtrele ve format et
    const books = result.files
      ?.filter(file => file.mimeType === 'application/pdf')
      .map(file => {
        const title = file.name?.replace('.pdf', '') || 'Untitled'
        const language = detectLanguage(title)
        
        return {
          id: `public_${file.id}`,
          title,
          driveFileId: file.id,
          coverUrl: null, // BookCover komponenti kullanacağız
          pageCount: Math.floor(Math.random() * 400) + 100,
          uploadDate: file.createdTime ? new Date(file.createdTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          progress: 0,
          isUserUploaded: false,
          isPublicBook: true,
          language: language,
          description: `${title} - ${language === 'tr' ? 'Türkçe kitap' : 'English book'}`,
          webViewLink: file.webViewLink,
          webContentLink: file.webContentLink,
          fileSize: file.size ? parseInt(file.size) : 0
        }
      }) || []

    return NextResponse.json({
      success: true,
      books: books
    })

  } catch (error) {
    console.error('Public books fetch error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}