import { NextResponse } from 'next/server'
import { createLemonSqueezyCheckout } from '@/app/actions/lemonsqueezy'

export async function GET() {
  try {
    // Test kullanıcı bilgileri
    const testUser = {
      id: 'test_user_123',
      email: 'test@fastreado.com',
      name: 'Test User'
    }

    // Premium plan için checkout oluştur
    const result = await createLemonSqueezyCheckout('premium', testUser.id, testUser.email)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test checkout created successfully',
        checkoutUrl: result.checkoutUrl,
        instructions: {
          step1: 'Copy the checkout URL below',
          step2: 'Open it in a new browser tab',
          step3: 'Use Lemon Squeezy test card: 4242 4242 4242 4242',
          step4: 'Complete the purchase',
          step5: 'Check webhook logs for subscription_created event'
        },
        testData: {
          userId: testUser.id,
          email: testUser.email,
          planId: 'premium'
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Test subscription error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}