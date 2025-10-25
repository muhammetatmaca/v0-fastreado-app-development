import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("X-CC-Webhook-Signature") as string

  // Webhook signature doğrulama
  const expectedSignature = crypto
    .createHmac("sha256", process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex")

  if (signature !== expectedSignature) {
    console.error("Invalid Coinbase Commerce webhook signature")
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (error) {
    console.error("Invalid JSON in webhook body")
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  console.log(`Received Coinbase Commerce event: ${event.type}`)

  try {
    switch (event.type) {
      case "charge:created": {
        const charge = event.data
        console.log(`Crypto payment created: ${charge.id}`)
        break
      }
      
      case "charge:confirmed": {
        const charge = event.data
        console.log(`Crypto payment confirmed: ${charge.id}`)
        
        // Burada kullanıcının premium planına geçirilmesi işlemi yapılabilir
        // charge.metadata'dan user bilgileri alınabilir
        
        break
      }
      
      case "charge:failed": {
        const charge = event.data
        console.log(`Crypto payment failed: ${charge.id}`)
        break
      }
      
      case "charge:delayed": {
        const charge = event.data
        console.log(`Crypto payment delayed: ${charge.id}`)
        break
      }
      
      case "charge:pending": {
        const charge = event.data
        console.log(`Crypto payment pending: ${charge.id}`)
        break
      }
      
      case "charge:resolved": {
        const charge = event.data
        console.log(`Crypto payment resolved: ${charge.id}`)
        break
      }
      
      default:
        console.log(`Unhandled Coinbase Commerce event type: ${event.type}`)
    }
  } catch (error) {
    console.error(`Error processing Coinbase Commerce webhook:`, error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}