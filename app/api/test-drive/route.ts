import { NextResponse } from 'next/server'
import { createDriveClient, listFilesInFolder } from '@/lib/google-drive-api'

export async function GET() {
  try {
    console.log('Testing Google Drive connection...')
    
    // Environment variables kontrolü
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    const userUploadsFolder = process.env.GOOGLE_DRIVE_USER_UPLOADS_FOLDER_ID
    const publicBooksFolder = process.env.GOOGLE_DRIVE_PUBLIC_BOOKS_FOLDER_ID

    console.log('Service Email:', serviceEmail)
    console.log('Private Key exists:', !!privateKey)
    console.log('User Uploads Folder:', userUploadsFolder)
    console.log('Public Books Folder:', publicBooksFolder)

    if (!serviceEmail || !privateKey) {
      return NextResponse.json({
        success: false,
        error: 'Google Service Account credentials not configured'
      }, { status: 500 })
    }

    // Drive client oluştur
    const drive = createDriveClient()
    console.log('Drive client created successfully')

    // Test: User uploads klasöründeki dosyaları listele
    if (userUploadsFolder) {
      console.log('Testing user uploads folder...')
      const userFilesResult = await listFilesInFolder(userUploadsFolder)
      console.log('User files result:', userFilesResult)
    }

    // Test: Public books klasöründeki dosyaları listele
    if (publicBooksFolder) {
      console.log('Testing public books folder...')
      const publicFilesResult = await listFilesInFolder(publicBooksFolder)
      console.log('Public files result:', publicFilesResult)
    }

    return NextResponse.json({
      success: true,
      message: 'Google Drive connection successful',
      config: {
        serviceEmail,
        hasPrivateKey: !!privateKey,
        userUploadsFolder,
        publicBooksFolder
      }
    })

  } catch (error) {
    console.error('Google Drive test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  }
}