"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/User"
import { SUBSCRIPTION_PLANS, getPlanPrice } from "@/lib/products"

const POLAR_API_URL = "https://api.polar.sh"

export async function createPolarCheckout(
  planId: string,
  userId: string,
  userEmail: string,
  language: string = 'tr'
) {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)

  if (!plan || plan.id === "free") {
    return { success: false, error: `Invalid plan: "${planId}"` }
  }

  const planPrice = getPlanPrice(plan, language)

  try {
    // Polar.sh checkout session oluştur
    const response = await fetch(`${POLAR_API_URL}/v1/checkouts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        product_price_id: planId === 'premium' ? process.env.POLAR_PREMIUM_PRICE_ID : process.env.POLAR_BASIC_PRICE_ID,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?payment=success`,
        customer_email: userEmail,
        metadata: {
          user_id: userId,
          plan_id: planId,
          language: language,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Polar API error: ${error}`)
    }

    const result = await response.json()
    
    return { 
      success: true, 
      checkoutUrl: result.url,
      data: {
        plan: plan.name,
        price: planPrice.price,
        currency: planPrice.symbol,
        checkout_id: result.id
      }
    }

  } catch (error) {
    console.error("Polar checkout creation failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function handlePolarWebhook(event: any) {
  try {
    await connectToDatabase()

    switch (event.type) {
      case "checkout.completed": {
        const checkout = event.data
        const userId = checkout.metadata?.user_id
        const planId = checkout.metadata?.plan_id

        if (!userId || !planId) {
          console.error("Missing user_id or plan_id in Polar webhook metadata")
          return { success: false, error: "Missing metadata" }
        }

        // Kullanıcıyı premium yap
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          premiumPlan: planId,
          premiumStartDate: new Date(),
          premiumEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
          paymentProvider: "polar",
          paymentId: checkout.id
        })

        console.log(`User ${userId} upgraded to ${planId} via Polar`)
        return { success: true }
      }

      case "subscription.created": {
        const subscription = event.data
        const userId = subscription.metadata?.user_id
        const planId = subscription.metadata?.plan_id

        if (!userId || !planId) {
          console.error("Missing user_id or plan_id in Polar webhook metadata")
          return { success: false, error: "Missing metadata" }
        }

        // Kullanıcıyı premium yap
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          premiumPlan: planId,
          premiumStartDate: new Date(),
          premiumEndDate: new Date(subscription.current_period_end * 1000),
          paymentProvider: "polar",
          paymentId: subscription.id
        })

        console.log(`User ${userId} subscription created via Polar`)
        return { success: true }
      }

      case "subscription.cancelled": {
        const subscription = event.data
        const userId = subscription.metadata?.user_id

        if (!userId) {
          console.error("Missing user_id in Polar webhook metadata")
          return { success: false, error: "Missing user_id" }
        }

        // Kullanıcının premium'unu iptal et
        await User.findByIdAndUpdate(userId, {
          isPremium: false,
          premiumPlan: null,
          premiumEndDate: new Date(),
          paymentProvider: null,
          paymentId: null
        })

        console.log(`User ${userId} subscription cancelled via Polar`)
        return { success: true }
      }

      default:
        console.log(`Unhandled Polar event: ${event.type}`)
        return { success: true }
    }
  } catch (error) {
    console.error("Polar webhook processing error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getPolarProducts() {
  try {
    const response = await fetch(`${POLAR_API_URL}/v1/products/`, {
      headers: {
        "Authorization": `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Polar API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.items || []

  } catch (error) {
    console.error("Failed to fetch Polar products:", error)
    return []
  }
}

export async function createPolarProduct(name: string, description: string, price: number) {
  try {
    const response = await fetch(`${POLAR_API_URL}/v1/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        type: "recurring",
        prices: [
          {
            type: "recurring",
            recurring_interval: "month",
            price_amount: price * 100, // Cents
            price_currency: "USD",
          }
        ],
        organization_id: process.env.POLAR_ORGANIZATION_ID,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Polar API error: ${error}`)
    }

    const result = await response.json()
    return { success: true, data: result }

  } catch (error) {
    console.error("Failed to create Polar product:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}