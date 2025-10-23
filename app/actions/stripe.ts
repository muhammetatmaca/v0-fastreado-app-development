"use server"

import { stripe } from "@/lib/stripe"
import { SUBSCRIPTION_PLANS, getPlanPrice } from "@/lib/products"
import { headers } from "next/headers"

export async function startCheckoutSession(planId: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not configured")
  }

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)

  if (!plan || plan.id === "free") {
    throw new Error(`Invalid plan: "${planId}"`)
  }

  try {
    // Dil tespiti için header kontrolü
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language') || 'tr'
    const language = acceptLanguage.includes('en') ? 'en' : 'tr'

    // Dile göre fiyat ve para birimi
    const planPrice = getPlanPrice(plan, language)
    const currency = language === 'en' ? 'usd' : 'try'
    const unitAmount = language === 'en' ? plan.priceInCentsUSD : plan.priceInCents

    // Create Checkout Sessions for subscription
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "never",
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/library?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })

    if (!session.client_secret) {
      throw new Error("Failed to get client secret from Stripe")
    }

    return session.client_secret
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/library`,
  })

  return session.url
}
