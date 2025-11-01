import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // JWT token'ı kontrol et
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token gerekli' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = decoded.userId

    await connectDB()

    // Kullanıcıyı bul ve PDF'lerini getir
    const user = await User.findById(userId).select('pdfs')
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    // Sadece kullanıcının yüklediği PDF'leri döndür
    const userPdfs = user.pdfs?.filter(pdf => pdf.isUserUploaded) || []

    return NextResponse.json({
      success: true,
      pdfs: userPdfs
    })

  } catch (error) {
    console.error('Get user PDFs error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // JWT token'ı kontrol et
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token gerekli' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = decoded.userId

    const { searchParams } = new URL(request.url)
    const pdfId = searchParams.get('pdfId')

    if (!pdfId) {
      return NextResponse.json({ error: 'PDF ID gerekli' }, { status: 400 })
    }

    await connectDB()

    // PDF'i kullanıcının listesinden kaldır
    const result = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          pdfs: { id: pdfId, isUserUploaded: true }
        }
      },
      { new: true }
    )

    if (!result) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'PDF başarıyla silindi'
    })

  } catch (error) {
    console.error('Delete PDF error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata') },
      { status: 500 }
    )
  }
}