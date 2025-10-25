import { NextRequest, NextResponse } from 'next/server'
import { handleLemonSqueezyWebhook } from '@/app/actions/lemonsqueezy'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature')
    
    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    const payload = JSON.parse(body)
    const eventName = payload.meta?.event_name
    
    if (!eventName) {
      console.error('No event name found in webhook payload')
      return NextResponse.json({ error: 'No event name' }, { status: 400 })
    }
    
    // Handle the webhook
    const result = await handleLemonSqueezyWebhook(eventName, payload)
    
    if (result.success) {
      return NextResponse.json({ message: 'Webhook processed successfully' })
    } else {
      console.error('Webhook processing failed:', result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Lemon Squeezy webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed' 
    }, { status: 500 })
  }
}

function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!signature || !process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return false
  }
  
  try {
    const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET)
    hmac.update(payload, 'utf8')
    const digest = hmac.digest('hex')
    
    // Convert to Uint8Array for timingSafeEqual
    const signatureBuffer = new Uint8Array(Buffer.from(signature, 'hex'))
    const digestBuffer = new Uint8Array(Buffer.from(digest, 'hex'))
    
    return crypto.timingSafeEqual(signatureBuffer, digestBuffer)
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}