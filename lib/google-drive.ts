// Google Drive PDF'leri - Gerçek kitaplar
export const GOOGLE_DRIVE_PDFS = [
  {
    id: "drive_nutuk",
    title: "Nutuk - Mustafa Kemal Atatürk", 
    driveFileId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", // Örnek ID
    coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    pageCount: 542,
    uploadDate: "2024-01-15",
    progress: 0,
    isUserUploaded: false,
    description: "Mustafa Kemal Atatürk'ün TBMM'de verdiği tarihi konuşma"
  },
  {
    id: "drive_safahat",
    title: "Safahat - Mehmet Akif Ersoy",
    driveFileId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", // Örnek ID
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop", 
    pageCount: 324,
    uploadDate: "2024-01-14",
    progress: 0,
    isUserUploaded: false,
    description: "Mehmet Akif Ersoy'un ünlü şiir kitabı"
  },
  {
    id: "drive_kuyucakli",
    title: "Kuyucaklı Yusuf - Sabahattin Ali",
    driveFileId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", // Örnek ID
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    pageCount: 198, 
    uploadDate: "2024-01-13",
    progress: 0,
    isUserUploaded: false,
    description: "Sabahattin Ali'nin ünlü romanı"
  },
  {
    id: "drive_icimizde",
    title: "İçimizdeki Şeytan - Sabahattin Ali", 
    driveFileId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", // Örnek ID
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    pageCount: 156,
    uploadDate: "2024-01-12", 
    progress: 0,
    isUserUploaded: false,
    description: "Sabahattin Ali'nin hikaye koleksiyonu"
  },
  {
    id: "drive_sinekli",
    title: "Sinekli Bakkal - Halide Edib Adıvar",
    driveFileId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", // Örnek ID
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    pageCount: 287,
    uploadDate: "2024-01-11",
    progress: 0, 
    isUserUploaded: false,
    description: "Halide Edib Adıvar'ın sosyal roman"
  }
]

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