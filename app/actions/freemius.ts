"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/User"
import { SUBSCRIPTION_PLANS, getPlanPrice } from "@/lib/products"

export async function createFreemiusCheckout(
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
    // Freemius checkout URL'i oluştur
    const checkoutParams = new URLSearchParams({
      plugin_id: process.env.FREEMIUS_ID!,
      public_key: process.env.FREEMIUS_PUBLIC_KEY!,
      plan_id: planId,
      pricing_id: planId === 'premium' ? '1' : '2', // Freemius'ta oluşturduğunuz pricing ID'leri
      currency: language === 'en' ? 'USD' : 'TRY',
      billing_cycle: 'monthly',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
      user_email: userEmail,
      user_firstname: 'User',
      user_lastname: 'Name',
      custom_data: JSON.stringify({
        user_id: userId,
        plan_id: planId,
        language: language,
      }),
    })

    const checkoutUrl = `https://checkout.freemius.com/mode/dialog/plugin/${process.env.FREEMIUS_ID}/plan/${planId}/?${checkoutParams.toString()}`

    return { 
      success: true, 
      checkoutUrl: checkoutUrl,
      data: {
        plan: plan.name,
        price: planPrice.price,
        currency: planPrice.symbol
      }
    }

  } catch (error) {
    console.error("Freemius checkout creation failed:", error)
    return { success: false, error: "Failed to create checkout session" }
  }
}

export async function handleFreemiusWebhook(event: any) {
  try {
    await connectToDatabase()

    switch (event.type) {
      case 'subscription.created':
      case 'subscription.updated': {
        const subscription = event.object
        const customData = JSON.parse(subscription.custom_data || '{}')
        const userId = customData.user_id

        if (!userId) {
          console.error("Missing user_id in Freemius webhook")
          return { success: false, error: "Missing user_id" }
        }

        // Kullanıcıyı premium yap
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          premiumPlan: customData.plan_id || 'premium',
          premiumStartDate: new Date(),
          premiumEndDate: new Date(subscription.next_payment * 1000), // Unix timestamp to Date
          paymentProvider: 'freemius',
          paymentId: subscription.id
        })

        console.log(`User ${userId} upgraded via Freemius`)
        return { success: true }
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        const subscription = event.object
        const customData = JSON.parse(subscription.custom_data || '{}')
        const userId = customData.user_id

        if (!userId) {
          console.error("Missing user_id in Freemius webhook")
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

        console.log(`User ${userId} subscription cancelled via Freemius`)
        return { success: true }
      }

      default:
        console.log(`Unhandled Freemius event: ${event.type}`)
        return { success: true }
    }
  } catch (error) {
    console.error("Freemius webhook processing error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getFreemiusPlans() {
  try {
    const response = await fetch(`https://api.freemius.com/v1/plugins/${process.env.FREEMIUS_ID}/plans.json`, {
      headers: {
        'Authorization': `Bearer ${process.env.FREEMIUS_SECRET_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Freemius API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.plans

  } catch (error) {
    console.error("Failed to fetch Freemius plans:", error)
    return []
  }
}