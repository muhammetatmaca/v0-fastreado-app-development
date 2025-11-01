"use server"

import { connectDB } from "@/lib/mongodb"
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
    // Freemius checkout URL'ini direkt oluştur
    const freemiusPlanId = process.env.FREEMIUS_PREMIUM_PLAN_ID || '35850'
    const isTestMode = process.env.FREEMIUS_TEST_MODE === 'true'
    
    // Checkout URL parametreleri
    const checkoutParams = new URLSearchParams({
      user_email: userEmail,
      user_firstname: 'User',
      user_lastname: 'Name',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/library?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
      custom_data: JSON.stringify({
        user_id: userId,
        plan_id: planId,
        language: language,
      }),
    })

    // Test mode için sandbox parametresi ekle
    if (isTestMode) {
      checkoutParams.append('sandbox', 'true')
    }

    // Freemius checkout URL'i
    const checkoutUrl = `https://checkout.freemius.com/product/${process.env.FREEMIUS_ID}/plan/${freemiusPlanId}/?${checkoutParams.toString()}`

    console.log('Freemius checkout URL:', checkoutUrl)

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
    await connectDB()

    console.log("Freemius webhook event:", JSON.stringify(event, null, 2))

    // Freemius webhook event yapısını kontrol et
    const eventType = event.type || event.event_type
    const eventData = event.data || event.object || event

    switch (eventType) {
      case 'subscription.created':
      case 'subscription.updated':
      case 'purchase.created':
      case 'purchase.completed': {
        // Custom data'dan user ID'yi al
        let userId = null
        
        if (eventData.custom_data) {
          try {
            const customData = typeof eventData.custom_data === 'string' 
              ? JSON.parse(eventData.custom_data) 
              : eventData.custom_data
            userId = customData.user_id
          } catch (e) {
            console.error("Failed to parse custom_data:", e)
          }
        }

        // Alternatif olarak user email'den bul
        if (!userId && eventData.user && eventData.user.email) {
          const user = await User.findOne({ email: eventData.user.email })
          if (user) userId = user._id.toString()
        }

        if (!userId) {
          console.error("Missing user_id in Freemius webhook:", eventData)
          return { success: false, error: "Missing user_id" }
        }

        // Premium süresini hesapla (30 gün)
        const premiumEndDate = new Date()
        premiumEndDate.setDate(premiumEndDate.getDate() + 30)

        // Kullanıcıyı premium yap
        const updateResult = await User.findByIdAndUpdate(userId, {
          isPremium: true,
          plan: 'premium',
          premiumPlan: 'premium',
          premiumStartDate: new Date(),
          premiumEndDate: premiumEndDate,
          paymentProvider: 'freemius',
          paymentId: eventData.id || eventData.subscription_id
        }, { new: true })

        console.log(`User ${userId} upgraded to premium via Freemius:`, updateResult)
        return { success: true }
      }

      case 'subscription.cancelled':
      case 'subscription.expired':
      case 'subscription.suspended': {
        let userId = null
        
        if (eventData.custom_data) {
          try {
            const customData = typeof eventData.custom_data === 'string' 
              ? JSON.parse(eventData.custom_data) 
              : eventData.custom_data
            userId = customData.user_id
          } catch (e) {
            console.error("Failed to parse custom_data:", e)
          }
        }

        if (!userId && eventData.user && eventData.user.email) {
          const user = await User.findOne({ email: eventData.user.email })
          if (user) userId = user._id.toString()
        }

        if (!userId) {
          console.error("Missing user_id in Freemius webhook")
          return { success: false, error: "Missing user_id" }
        }

        // Kullanıcının premium'unu iptal et
        await User.findByIdAndUpdate(userId, {
          isPremium: false,
          plan: 'free',
          premiumPlan: null,
          premiumEndDate: new Date(),
          paymentProvider: null,
          paymentId: null
        })

        console.log(`User ${userId} subscription cancelled via Freemius`)
        return { success: true }
      }

      default:
        console.log(`Unhandled Freemius event: ${eventType}`)
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