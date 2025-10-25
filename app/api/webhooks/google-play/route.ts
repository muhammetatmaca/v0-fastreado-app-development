import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

// Google Play purchase verification webhook
export async function POST(request: NextRequest) {
  try {
    const purchase = await request.json()
    
    // Verify the purchase with Google Play Developer API
    const isValid = await verifyPurchaseWithGoogle(purchase)
    
    if (isValid) {
      // Update user subscription status
      await updateUserSubscription(purchase)
      
      return NextResponse.json({ 
        verified: true,
        message: 'Purchase verified successfully' 
      })
    }
    
    return NextResponse.json({ 
      verified: false,
      message: 'Invalid purchase' 
    }, { status: 400 })
    
  } catch (error) {
    console.error('Google Play webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed' 
    }, { status: 500 })
  }
}

async function verifyPurchaseWithGoogle(purchase: any) {
  try {
    // In production, use Google Play Developer API to verify
    // https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.products/get
    
    const { productId, purchaseToken } = purchase
    
    // Mock verification for development
    // Replace with actual Google Play API call
    if (productId && purchaseToken) {
      return true
    }
    
    return false
  } catch (error) {
    console.error('Google Play verification error:', error)
    return false
  }
}

async function updateUserSubscription(purchase: any) {
  try {
    await connectDB()
    
    // Extract user info from purchase (you'll need to include user ID in purchase)
    const userId = purchase.userId
    
    if (!userId) {
      throw new Error('User ID not found in purchase')
    }
    
    const user = await User.findById(userId)
    
    if (user) {
      // Update user to premium
      user.plan = 'premium'
      
      // Add purchase record
      if (!user.purchases) {
        user.purchases = []
      }
      
      user.purchases.push({
        provider: 'google-play',
        productId: purchase.productId,
        purchaseToken: purchase.purchaseToken,
        orderId: purchase.orderId,
        purchaseTime: new Date(purchase.purchaseTime),
        amount: getProductPrice(purchase.productId),
        currency: 'TRY',
        status: 'completed'
      })
      
      await user.save()
    }
  } catch (error) {
    console.error('Update user subscription error:', error)
    throw error
  }
}

function getProductPrice(productId: string): number {
  const prices: Record<string, number> = {
    'fastreado_premium_monthly': 99.99,
    'fastreado_premium_yearly': 999.99
  }
  
  return prices[productId] || 0
}