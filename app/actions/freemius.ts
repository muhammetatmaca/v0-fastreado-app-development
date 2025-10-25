"use server"

import { SUBSCRIPTION_PLANS, getPlanPrice } from "@/lib/products"

export async function createFreemiusCheckout(planId: string, language: string = 'tr') {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)

  if (!plan || plan.id === "free") {
    throw new Error(`Invalid plan: "${planId}"`)
  }

  const planPrice = getPlanPrice(plan, language)

  try {
    // Freemius API ile checkout session oluştur
    const response = await fetch('https://api.freemius.com/v1/plugins/checkout.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FREEMIUS_SECRET_KEY}`,
      },
      body: JSON.stringify({
        plugin_id: process.env.FREEMIUS_ID,
        plan_id: planId,
        pricing_id: planId === 'premium' ? 'premium_pricing_id' : 'basic_pricing_id',
        currency: language === 'en' ? 'USD' : 'TRY',
        billing_cycle: 'monthly',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/library?upgraded=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        user: {
          email: '', // Kullanıcı email'i buraya gelecek
          first: '', // Kullanıcı adı buraya gelecek
          last: '',
        },
        custom_data: {
          user_id: '', // Kullanıcı ID'si buraya gelecek
          plan_id: planId,
          language: language,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Freemius API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.checkout_url

  } catch (error) {
    console.error("Freemius checkout creation failed:", error)
    throw new Error("Failed to create checkout session")
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