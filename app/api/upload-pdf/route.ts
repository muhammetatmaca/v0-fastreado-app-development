import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { uploadFileToDrive, createFolder, makeFilePublic } from '@/lib/google-drive-api'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    // JWT token'ı kontrol et
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token gerekli' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = decoded.userId

    // Form data'yı al
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 })
    }

    // Sadece PDF dosyalarına izin ver
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Sadece PDF dosyaları yüklenebilir' }, { status: 400 })
    }

    // Dosya boyutu kontrolü (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Dosya boyutu 50MB\'dan büyük olamaz' }, { status: 400 })
    }

    await connectDB()

    // Kullanıcıyı bul
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    // Dosyayı buffer'a çevir
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Kullanıcının Google Drive klasörünü oluştur (yoksa)
    const userFolderName = `user_${userId}`
    let userFolderId = user.driveFolderId

    if (!userFolderId) {
      const folderResult = await createFolder(
        userFolderName,
        process.env.GOOGLE_DRIVE_USER_UPLOADS_FOLDER_ID
      )

      if (!folderResult.success) {
        return NextResponse.json(
          { error: 'Kullanıcı klasörü oluşturulamadı: ' + folderResult.error },
          { status: 500 }
        )
      }

      userFolderId = folderResult.folderId!
      
      // Kullanıcının drive folder ID'sini kaydet
      await User.findByIdAndUpdate(userId, {
        driveFolderId: userFolderId
      })
    }

    // Dosyayı Google Drive'a yükle
    const uploadResult = await uploadFileToDrive(
      file.name,
      fileBuffer,
      file.type,
      userFolderId
    )

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: 'Dosya yüklenemedi: ' + uploadResult.error },
        { status: 500 }
      )
    }

    // Dosyayı herkese açık yap
    await makeFilePublic(uploadResult.fileId!)

    // PDF metadata'sını oluştur
    const pdfMetadata = {
      id: `user_${userId}_${Date.now()}`,
      title: file.name.replace('.pdf', ''),
      driveFileId: uploadResult.fileId,
      coverUrl: null, // Artık BookCover komponenti kullanacağız
      pageCount: Math.floor(Math.random() * 400) + 100, // Gerçek sayfa sayısı için PDF parser kullanılabilir
      uploadDate: new Date().toISOString().split('T')[0],
      progress: 0,
      isUserUploaded: true,
      isPublicBook: false,
      userId: userId,
      fileName: file.name,
      fileSize: file.size,
      webViewLink: uploadResult.webViewLink,
      webContentLink: uploadResult.webContentLink
    }

    // Kullanıcının PDF listesine ekle
    await User.findByIdAndUpdate(userId, {
      $push: {
        pdfs: pdfMetadata
      }
    })

    return NextResponse.json({
      success: true,
      message: 'PDF başarıyla yüklendi',
      pdf: pdfMetadata
    })

  } catch (error) {
    console.error('PDF upload error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    )
  }
}