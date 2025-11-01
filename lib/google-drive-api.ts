import { google } from 'googleapis'

// Google Drive API istemcisini oluştur
export function createDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  })

  return google.drive({ version: 'v3', auth })
}

// Dosya yükle
export async function uploadFileToDrive(
  fileName: string,
  fileBuffer: Buffer,
  mimeType: string,
  parentFolderId?: string
) {
  try {
    const drive = createDriveClient()

    const fileMetadata: any = {
      name: fileName,
    }

    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId]
    }

    const media = {
      mimeType,
      body: fileBuffer,
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id,name,webViewLink,webContentLink',
    })

    return {
      success: true,
      fileId: response.data.id,
      fileName: response.data.name,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink,
    }
  } catch (error) {
    console.error('Google Drive upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Klasör oluştur
export async function createFolder(folderName: string, parentFolderId?: string) {
  try {
    const drive = createDriveClient()

    const fileMetadata: any = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }

    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId]
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id,name',
    })

    return {
      success: true,
      folderId: response.data.id,
      folderName: response.data.name,
    }
  } catch (error) {
    console.error('Google Drive folder creation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Dosya izinlerini ayarla (herkese açık)
export async function makeFilePublic(fileId: string) {
  try {
    const drive = createDriveClient()

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Google Drive permission error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Dosya bilgilerini getir
export async function getFileInfo(fileId: string) {
  try {
    const drive = createDriveClient()

    const response = await drive.files.get({
      fileId,
      fields: 'id,name,size,mimeType,webViewLink,webContentLink,thumbnailLink',
    })

    return {
      success: true,
      file: response.data,
    }
  } catch (error) {
    console.error('Google Drive file info error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Klasördeki dosyaları listele
export async function listFilesInFolder(folderId: string) {
  try {
    console.log('listFilesInFolder called with folderId:', folderId)
    const drive = createDriveClient()
    console.log('Drive client created')

    const query = `'${folderId}' in parents and trashed=false`
    console.log('Query:', query)

    const response = await drive.files.list({
      q: query,
      fields: 'files(id,name,size,mimeType,webViewLink,webContentLink,thumbnailLink,createdTime)',
    })

    console.log('Drive API response:', {
      filesCount: response.data.files?.length || 0,
      files: response.data.files?.map(f => ({ name: f.name, mimeType: f.mimeType }))
    })

    return {
      success: true,
      files: response.data.files || [],
    }
  } catch (error) {
    console.error('Google Drive list files error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}