import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { verifyPaddleWebhook } from "@/app/actions/paddle"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("P-Signature") as string

  // Webhook signature doğrulama
  const isValid = await verifyPaddleWebhook(body, signature)
  
  if (!isValid) {
    console.error("Invalid Paddle webhook signature")
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  let event
  try {
    // Paddle webhook'ları form-encoded gelir
    const params = new URLSearchParams(body)
    event = Object.fromEntries(params)
  } catch (error) {
    console.error("Invalid webhook body format")
    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  }

  console.log(`Received Paddle webhook: ${event.alert_name}`)

  try {
    switch (event.alert_name) {
      case "subscription_created": {
        console.log(`Subscription created: ${event.subscription_id}`)
        
        // Passthrough data'dan user bilgilerini al
        const passthrough = event.passthrough ? JSON.parse(event.passthrough) : {}
        const userId = passthrough.user_id
        const planId = passthrough.plan_id
        
        // Burada kullanıcının premium planına geçirilmesi işlemi yapılabilir
        // Örneğin: database'de user.plan = 'premium' güncelleme
        
        break
      }
      
      case "subscription_updated": {
        console.log(`Subscription updated: ${event.subscription_id}`)
        break
      }
      
      case "subscription_cancelled": {
        console.log(`Subscription cancelled: ${event.subscription_id}`)
        
        // Burada kullanıcının free plana düşürülmesi işlemi yapılabilir
        // Örneğin: database'de user.plan = 'free' güncelleme
        
        break
      }
      
      case "subscription_payment_succeeded": {
        console.log(`Payment succeeded: ${event.subscription_id}`)
        break
      }
      
      case "subscription_payment_failed": {
        console.log(`Payment failed: ${event.subscription_id}`)
        break
      }
      
      case "subscription_payment_refunded": {
        console.log(`Payment refunded: ${event.subscription_id}`)
        break
      }
      
      case "payment_succeeded": {
        console.log(`One-time payment succeeded: ${event.order_id}`)
        break
      }
      
      case "payment_refunded": {
        console.log(`One-time payment refunded: ${event.order_id}`)
        break
      }
      
      default:
        console.log(`Unhandled Paddle webhook: ${event.alert_name}`)
    }
  } catch (error) {
    console.error(`Error processing Paddle webhook:`, error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}