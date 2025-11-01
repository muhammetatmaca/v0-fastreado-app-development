"use server"

import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"

// Test amaçlı - kullanıcıyı premium yap
export async function makeUserPremiumForTest(userId: string) {
  try {
    await connectDB()
    
    const premiumEndDate = new Date()
    premiumEndDate.setDate(premiumEndDate.getDate() + 30) // 30 gün premium
    
    const result = await User.findByIdAndUpdate(userId, {
      isPremium: true,
      plan: 'premium',
      premiumPlan: 'premium',
      premiumStartDate: new Date(),
      premiumEndDate: premiumEndDate,
      paymentProvider: 'test',
      paymentId: 'test_' + Date.now()
    }, { new: true })
    
    console.log("User made premium for test:", result)
    return { success: true, user: result }
    
  } catch (error) {
    console.error("Test premium error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Test amaçlı - kullanıcıyı free yap
export async function makeUserFreeForTest(userId: string) {
  try {
    await connectDB()
    
    const result = await User.findByIdAndUpdate(userId, {
      isPremium: false,
      plan: 'free',
      premiumPlan: null,
      premiumEndDate: new Date(),
      paymentProvider: null,
      paymentId: null
    }, { new: true })
    
    console.log("User made free for test:", result)
    return { success: true, user: result }
    
  } catch (error) {
    console.error("Test free error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}