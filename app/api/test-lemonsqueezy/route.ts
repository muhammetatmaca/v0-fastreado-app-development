import { NextResponse } from 'next/server'
import { getLemonSqueezyProducts } from '@/app/actions/lemonsqueezy'

export async function GET() {
  try {
    const result = await getLemonSqueezyProducts()
    
    return NextResponse.json({
      success: true,
      message: 'Lemon Squeezy connection test',
      data: result
    })
  } catch (error) {
    console.error('Lemon Squeezy test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}