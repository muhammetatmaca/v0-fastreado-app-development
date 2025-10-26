import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { handleFreemiusWebhook } from "@/app/actions/freemius"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("X-FS-Signature") as string

  // Freemius webhook signature doğrulama
  const expectedSignature = crypto
    .createHmac("sha256", process.env.FREEMIUS_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex")

  if (signature !== expectedSignature) {
    console.error("Invalid Freemius webhook signature")
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (error) {
    console.error("Invalid JSON in Freemius webhook body")
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  console.log(`Received Freemius event: ${event.type}`)

  try {
    const result = await handleFreemiusWebhook(event)
    
    if (!result.success) {
      console.error("Freemius webhook processing failed:", result.error)
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