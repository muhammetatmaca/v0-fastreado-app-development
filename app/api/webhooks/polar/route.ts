import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { handlePolarWebhook } from "@/app/actions/polar"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("polar-signature") as string
  const timestamp = headersList.get("polar-timestamp") as string

  // Polar webhook signature doğrulama
  const expectedSignature = crypto
    .createHmac("sha256", process.env.POLAR_WEBHOOK_SECRET!)
    .update(timestamp + "." + body)
    .digest("hex")

  const computedSignature = `v1=${expectedSignature}`

  if (signature !== computedSignature) {
    console.error("Invalid Polar webhook signature")
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (error) {
    console.error("Invalid JSON in Polar webhook body")
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  console.log(`Received Polar event: ${event.type}`)

  try {
    const result = await handlePolarWebhook(event)
    
    if (!result.success) {
      console.error("Polar webhook processing failed:", result.error)
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Error processing Polar webhook:`, error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}