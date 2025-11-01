import { NextResponse } from 'next/server'
import { createDriveClient } from '@/lib/google-drive-api'

export async function GET() {
  try {
    console.log('=== TESTING GOOGLE DRIVE PERMISSIONS ===')
    
    const drive = createDriveClient()
    const publicBooksFolder = process.env.GOOGLE_DRIVE_PUBLIC_BOOKS_FOLDER_ID
    
    console.log('Testing folder access for:', publicBooksFolder)
    
    // Klasör bilgilerini almaya çalış
    const folderInfo = await drive.files.get({
      fileId: publicBooksFolder!,
      fields: 'id,name,permissions'
    })
    
    console.log('Folder info:', folderInfo.data)
    
    // Klasördeki dosyaları listele (basit sorgu)
    const filesList = await drive.files.list({
      q: `'${publicBooksFolder}' in parents and trashed=false`,
      fields: 'files(id,name,mimeType,size,createdTime)',
      pageSize: 20
    })
    
    console.log('Files in folder:', filesList.data.files?.length || 0)
    console.log('Files:', filesList.data.files?.map(f => ({ name: f.name, mimeType: f.mimeType })))
    
    return NextResponse.json({
      success: true,
      folderInfo: folderInfo.data,
      filesCount: filesList.data.files?.length || 0,
      files: filesList.data.files
    })
    
  } catch (error) {
    console.error('Permission test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  }
}