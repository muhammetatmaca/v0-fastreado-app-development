import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, userEmail } = await request.json()
    
    if (!planId || !userId || !userEmail) {
      return NextResponse.json({ 
        error: 'Missing required fields: planId, userId, userEmail' 
      }, { status: 400 })
    }

    // Import dynamically to avoid MongoDB connection issues
    const { createLemonSqueezyCheckout } = await import('@/app/actions/lemonsqueezy')
    const result = await createLemonSqueezyCheckout(planId, userId, userEmail)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Test checkout error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test checkout endpoint',
    usage: 'POST with { planId: "premium", userId: "123", userEmail: "test@example.com" }'
  })
}