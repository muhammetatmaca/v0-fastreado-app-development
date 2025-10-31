// Google Drive PDF'leri - Genel kitaplar (public_books klasöründen)
export const GOOGLE_DRIVE_PUBLIC_BOOKS = [
  {
    id: "public_nutuk",
    title: "Nutuk - Mustafa Kemal Atatürk", 
    driveFileId: "YOUR_NUTUK_FILE_ID", // Gerçek Google Drive file ID'nizi buraya yazın
    coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    pageCount: 542,
    uploadDate: "2024-01-15",
    progress: 0,
    isUserUploaded: false,
    isPublicBook: true,
    description: "Mustafa Kemal Atatürk'ün TBMM'de verdiği tarihi konuşma"
  },
  {
    id: "public_safahat",
    title: "Safahat - Mehmet Akif Ersoy",
    driveFileId: "YOUR_SAFAHAT_FILE_ID", // Gerçek Google Drive file ID'nizi buraya yazın
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop", 
    pageCount: 324,
    uploadDate: "2024-01-14",
    progress: 0,
    isUserUploaded: false,
    isPublicBook: true,
    description: "Mehmet Akif Ersoy'un ünlü şiir kitabı"
  },
  {
    id: "public_kuyucakli",
    title: "Kuyucaklı Yusuf - Sabahattin Ali",
    driveFileId: "YOUR_KUYUCAKLI_FILE_ID", // Gerçek Google Drive file ID'nizi buraya yazın
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    pageCount: 198, 
    uploadDate: "2024-01-13",
    progress: 0,
    isUserUploaded: false,
    isPublicBook: true,
    description: "Sabahattin Ali'nin ünlü romanı"
  },
  {
    id: "public_icimizde",
    title: "İçimizdeki Şeytan - Sabahattin Ali", 
    driveFileId: "YOUR_ICIMIZDE_FILE_ID", // Gerçek Google Drive file ID'nizi buraya yazın
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    pageCount: 156,
    uploadDate: "2024-01-12", 
    progress: 0,
    isUserUploaded: false,
    isPublicBook: true,
    description: "Sabahattin Ali'nin hikaye koleksiyonu"
  },
  {
    id: "public_sinekli",
    title: "Sinekli Bakkal - Halide Edib Adıvar",
    driveFileId: "YOUR_SINEKLI_FILE_ID", // Gerçek Google Drive file ID'nizi buraya yazın
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    pageCount: 287,
    uploadDate: "2024-01-11",
    progress: 0, 
    isUserUploaded: false,
    isPublicBook: true,
    description: "Halide Edib Adıvar'ın sosyal romanı"
  },
  // Diğer 5 kitabınızı da buraya ekleyin...
  {
    id: "public_book6",
    title: "6. Kitap Adı",
    driveFileId: "YOUR_BOOK6_FILE_ID",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    pageCount: 200,
    uploadDate: "2024-01-10",
    progress: 0,
    isUserUploaded: false,
    isPublicBook: true,
    description: "6. kitap açıklaması"
  },
  {
    id: "public_book7",
    title: "7. Kitap Adı", 
    driveFileId: "YOUR_BOOK7_FILE_ID",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    pageCount: 250,
    uploadDate: "2024-01-09",
    progress: 0,
    isUserUploaded: false,
    isPublicBook: true,
    description: "7. kitap açıklaması"
  },
  {
    id: "public_book8",
    title: "8. Kitap Adı",
    driveFileId: "YOUR_BOOK8_FILE_ID", 
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    pageCount: 180,
    uploadDate: "2024-01-08",
    progress: 0,
    isUserUploaded: false,
    isPublicBook: true,
    description: "8. kitap açıklaması"
  },
  {
    id: "public_book9",
    title: "9. Kitap Adı",
    driveFileId: "YOUR_BOOK9_FILE_ID",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop", 
    pageCount: 320,
    uploadDate: "2024-01-07",
    progress: 0,
    isUserUploaded: false,
    isPublicBook: true,
    description: "9. kitap açıklaması"
  },
  {
    id: "public_book10",
    title: "10. Kitap Adı",
    driveFileId: "YOUR_BOOK10_FILE_ID",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    pageCount: 280,
    uploadDate: "2024-01-06", 
    progress: 0,
    isUserUploaded: false,
    isPublicBook: true,
    description: "10. kitap açıklaması"
  }
]

// Geriye uyumluluk için
export const GOOGLE_DRIVE_PDFS = GOOGLE_DRIVE_PUBLIC_BOOKS

// Google Drive PDF URL'i oluştur
export function getGoogleDrivePdfUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`
}

// Google Drive PDF'i embed URL'i
export function getGoogleDriveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`
}

// Google Drive thumbnail URL'i
export function getGoogleDriveThumbnailUrl(fileId: string, size: string = "w400-h600"): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`
}

// PDF'i Google Drive'dan indir
export async function downloadGoogleDrivePdf(fileId: string): Promise<Blob | null> {
  try {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
    const response = await fetch(downloadUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.blob()
  } catch (error) {
    console.error('Google Drive PDF download error:', error)
    return null
  }
}