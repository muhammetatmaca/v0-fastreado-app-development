import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { handleLemonSqueezyWebhook } from "@/app/actions/lemonsqueezy"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("X-Signature") as string

  // Webhook signature doğrulama
  if (process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex")

    if (signature !== expectedSignature) {
      console.error("Invalid Lemon Squeezy webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (error) {
    console.error("Invalid JSON in webhook body")
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  console.log(`Received Lemon Squeezy event: ${event.meta?.event_name}`)

  try {
    const result = await handleLemonSqueezyWebhook(event.meta?.event_name, event)
    
    if (!result.success) {
      console.error("Webhook processing failed:", result.error)
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Error processing Lemon Squeezy webhook:`, error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({ 
    status: "Lemon Squeezy webhook endpoint is active",
    timestamp: new Date().toISOString()
  })
}