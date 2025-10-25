import { NextRequest, NextResponse } from 'next/server'

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

    console.log('🎉 WEBHOOK TEST - Subscription Created!')
    console.log('Event:', testPayload.meta.event_name)
    console.log('User ID:', testPayload.data.attributes.custom_data.user_id)
    console.log('Plan ID:', testPayload.data.attributes.custom_data.plan_id)
    console.log('Amount:', testPayload.data.attributes.subtotal / 100, testPayload.data.attributes.currency)
    
    // Simulate user upgrade
    const userUpgrade = {
      userId: testPayload.data.attributes.custom_data.user_id,
      oldPlan: 'free',
      newPlan: 'premium',
      subscriptionId: testPayload.data.id,
      amount: testPayload.data.attributes.subtotal / 100,
      currency: testPayload.data.attributes.currency,
      timestamp: testPayload.data.attributes.created_at
    }

    console.log('✅ User upgraded:', userUpgrade)

    return NextResponse.json({
      success: true,
      message: 'Webhook simulation successful! User upgraded to premium.',
      simulation: {
        event: 'subscription_created',
        action: 'user_upgraded',
        details: userUpgrade
      },
      nextSteps: [
        '1. User can now upload unlimited PDFs',
        '2. User has access to AI features',
        '3. User gets priority support'
      ]
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
    message: 'Simple webhook test endpoint (no database)',
    usage: 'POST to simulate subscription events',
    testFlow: {
      step1: 'POST to this endpoint',
      step2: 'Check console logs',
      step3: 'See user upgrade simulation',
      step4: 'Verify premium features unlocked'
    }
  })
}