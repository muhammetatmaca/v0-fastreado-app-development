import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { handleFreemiusWebhook } from "@/app/actions/freemius"

// Test endpoint - webhook'un çalışıp çalışmadığını kontrol etmek için
export async function GET() {
  return NextResponse.json({ 
    status: "Freemius webhook endpoint is active",
    timestamp: new Date().toISOString(),
    hasWebhookSecret: !!process.env.FREEMIUS_WEBHOOK_SECRET
  })
}

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("X-FS-Signature") as string

  console.log("Freemius webhook received:", {
    hasSignature: !!signature,
    bodyLength: body.length,
    timestamp: new Date().toISOString()
  })

  // Webhook signature doğrulama (sadece signature varsa)
  if (signature && process.env.FREEMIUS_WEBHOOK_SECRET) {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.FREEMIUS_WEBHOOK_SECRET)
      .update(body)
      .digest("hex")

    if (signature !== expectedSignature) {
      console.error("Invalid Freemius webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }
  } else if (!signature) {
    console.warn("No signature provided in Freemius webhook")
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (error) {
    console.error("Invalid JSON in webhook body")
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  console.log(`Received Freemius event: ${event.type}`)

  try {
    const result = await handleFreemiusWebhook(event)
    
    if (!result.success) {
      console.error("Webhook processing failed:", result.error)
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Error processing Freemius webhook:`, error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}