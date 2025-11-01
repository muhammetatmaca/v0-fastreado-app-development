"use server"

import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"

export async function checkUserPremiumStatus(userId: string) {
  try {
    await connectDB()
    
    const user = await User.findById(userId)
    if (!user) {
      return { isPremium: false, isExpired: false }
    }

    // Eğer premium değilse
    if (!user.isPremium || !user.premiumEndDate) {
      return { isPremium: false, isExpired: false }
    }

    // Premium süresini kontrol et
    const now = new Date()
    const endDate = new Date(user.premiumEndDate)
    
    if (now > endDate) {
      // Süre dolmuş, kullanıcıyı free'ye düşür
      await User.findByIdAndUpdate(userId, {
        isPremium: false,
        plan: 'free',
        premiumPlan: null,
        premiumEndDate: null
      })
      
      return { isPremium: false, isExpired: true }
    }

    // Premium aktif
    return { 
      isPremium: true, 
      isExpired: false,
      endDate: endDate,
      daysLeft: Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }

  } catch (error) {
    console.error("Premium status check error:", error)
    return { isPremium: false, isExpired: false }
  }
}

export async function getUserPDFLimit(userId: string) {
  try {
    const premiumStatus = await checkUserPremiumStatus(userId)
    
    if (premiumStatus.isPremium) {
      return { limit: null, unlimited: true } // Sınırsız
    } else {
      return { limit: 2, unlimited: false } // Free plan: 2 PDF
    }
  } catch (error) {
    console.error("PDF limit check error:", error)
    return { limit: 2, unlimited: false }
  }
}

export async function canUserAccessPDF(userId: string, pdfId: string) {
  try {
    await connectDB()
    
    const user = await User.findById(userId)
    if (!user) return false

    // PDF'i kullanıcının PDF'leri arasında bul
    const pdf = user.pdfs?.find(p => p.id === pdfId)
    if (!pdf) return false

    // Premium kullanıcı tüm PDF'lere erişebilir
    const premiumStatus = await checkUserPremiumStatus(userId)
    if (premiumStatus.isPremium) {
      return true
    }

    // Free kullanıcı sadece son 2 PDF'e erişebilir
    const sortedPDFs = user.pdfs?.sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    ) || []
    
    const allowedPDFs = sortedPDFs.slice(0, 2)
    return allowedPDFs.some(p => p.id === pdfId)

  } catch (error) {
    console.error("PDF access check error:", error)
    return false
  }
}