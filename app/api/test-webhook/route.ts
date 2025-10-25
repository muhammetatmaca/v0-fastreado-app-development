import { NextRequest, NextResponse } from 'next/server'
import { handleLemonSqueezyWebhook } from '@/app/actions/lemonsqueezy'

export async function POST(request: NextRequest) {
  try {
    // Test webhook payload (simulates Lemon Squeezy webhook)
    const testPayload = {
      meta: {
        event_name: 'subscription_created'
      },
      data: {
        id: 'sub_test_123',
        attributes: {
          created_at: new Date().toISOString(),
          subtotal: 9990, // ₺99.90 in cents
          currency: 'TRY',
          order_id: 'order_test_123',
          custom_data: {
            user_id: 'test_user_123',
            plan_id: 'premium'
          }
        }
      }
    }

    console.log('Testing webhook with payload:', testPayload)
    
    const result = await handleLemonSqueezyWebhook(
      testPayload.meta.event_name,
      testPayload
    )

    return NextResponse.json({
      success: true,
      message: 'Webhook test completed',
      result: result,
      testPayload: testPayload
    })
  } catch (error) {
    console.error('Webhook test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook test endpoint',
    usage: 'POST to simulate a subscription_created webhook',
    testScenarios: [
      'subscription_created - User upgrade to premium',
      'subscription_cancelled - User downgrade to free',
      'subscription_expired - User downgrade to free'
    ]
  })
}