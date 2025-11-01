// Simplified PDF text extraction using API

export interface ExtractedPage {
  pageNumber: number
  text: string
}

export interface ExtractedPdf {
  pages: ExtractedPage[]
  totalPages: number
  fullText: string
}

/**
 * PDF'den text çıkarır (API kullanarak)
 */
export async function extractTextFromGoogleDrivePdf(driveFileId: string): Promise<ExtractedPdf | null> {
  try {
    const response = await fetch('/api/extract-pdf-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        driveFileId,
        isGoogleDrive: true
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.success) {
      return {
        pages: result.pages,
        totalPages: result.totalPages,
        fullText: result.text
      }
    }
    
    return null
  } catch (error) {
    console.error('Error extracting text from Google Drive PDF:', error)
    return null
  }
}

/**
 * Base64 PDF'den text çıkarır (API kullanarak)
 */
export async function extractTextFromBase64Pdf(base64Data: string): Promise<ExtractedPdf | null> {
  try {
    const response = await fetch('/api/extract-pdf-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        driveFileId: 'user_pdf_' + Date.now(), // Unique ID for user PDF
        isGoogleDrive: false,
        base64Data
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.success) {
      return {
        pages: result.pages,
        totalPages: result.totalPages,
        fullText: result.text
      }
    }
    
    return null
  } catch (error) {
    console.error('Error extracting text from base64 PDF:', error)
    return null
  }
}



/**
 * Text'i sayfalara böl (uzun text'ler için)
 */
export function splitTextIntoPages(text: string, wordsPerPage: number = 500): ExtractedPage[] {
  const words = text.split(/\s+/)
  const pages: ExtractedPage[] = []
  
  for (let i = 0; i < words.length; i += wordsPerPage) {
    const pageWords = words.slice(i, i + wordsPerPage)
    const pageText = pageWords.join(' ')
    
    pages.push({
      pageNumber: Math.floor(i / wordsPerPage) + 1,
      text: pageText
    })
  }
  
  return pages
}

/**
 * PDF text'ini temizle ve formatla
 */
export function cleanPdfText(text: string): string {
  return text
    // Çoklu boşlukları tek boşluğa çevir
    .replace(/\s+/g, ' ')
    // Satır başlarındaki ve sonlarındaki boşlukları kaldır
    .replace(/^\s+|\s+$/gm, '')
    // Çoklu satır sonlarını düzenle
    .replace(/\n{3,}/g, '\n\n')
    // Özel karakterleri temizle
    .replace(/[^\w\s\.,!?;:()\-"']/g, '')
    .trim()
}