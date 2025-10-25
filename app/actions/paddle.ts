"use server"

import { SUBSCRIPTION_PLANS, getPlanPrice } from "@/lib/products"

export async function createPaddleCheckout(planId: string, language: string = 'tr') {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)

  if (!plan || plan.id === "free") {
    throw new Error(`Invalid plan: "${planId}"`)
  }

  const planPrice = getPlanPrice(plan, language)

  try {
    // Paddle API ile checkout session oluştur
    const response = await fetch('https://vendors.paddle.com/api/2.0/product/generate_pay_link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vendor_id: process.env.PADDLE_VENDOR_ID,
        vendor_auth_code: process.env.PADDLE_API_KEY,
        product_id: planId === 'premium' ? 'premium_product_id' : 'basic_product_id', // Gerçek product ID'leri buraya
        title: plan.name,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/paddle`,
        prices: [
          language === 'en' ? `USD:${planPrice.price}` : `TRY:${planPrice.price}`
        ],
        recurring_prices: [
          language === 'en' ? `USD:${planPrice.price}` : `TRY:${planPrice.price}`
        ],
        trial_days: 0,
        custom_message: plan.description,
        coupon_code: '',
        discountable: 1,
        image_url: '',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/library?upgraded=true`,
        quantity_variable: 0,
        expires: '',
        affiliates: [],
        marketing_consent: '',
        customer_email: '',
        customer_country: language === 'tr' ? 'TR' : 'US',
        customer_postcode: '',
        passthrough: JSON.stringify({
          user_id: '', // Kullanıcı ID'si buraya gelecek
          plan_id: planId,
          language: language,
        }),
      }),
    })

    if (!response.ok) {
      throw new Error(`Paddle API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(`Paddle API error: ${data.error?.message || 'Unknown error'}`)
    }

    return data.response.url

  } catch (error) {
    console.error("Paddle checkout creation failed:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function getPaddleProducts() {
  try {
    const response = await fetch('https://vendors.paddle.com/api/2.0/product/get_products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vendor_id: process.env.PADDLE_VENDOR_ID,
        vendor_auth_code: process.env.PADDLE_API_KEY,
      }),
    })

    if (!response.ok) {
      throw new Error(`Paddle API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(`Paddle API error: ${data.error?.message || 'Unknown error'}`)
    }

    return data.response

  } catch (error) {
    console.error("Failed to fetch Paddle products:", error)
    return []
  }
}

export async function verifyPaddleWebhook(body: string, signature: string): Promise<boolean> {
  try {
    const crypto = require('crypto')
    const publicKey = process.env.PADDLE_PUBLIC_KEY!
    
    // Paddle webhook signature doğrulama
    const verifier = crypto.createVerify('sha1')
    verifier.update(body)
    
    return verifier.verify(publicKey, signature, 'base64')
  } catch (error) {
    console.error("Paddle webhook verification failed:", error)
    return false
  }
}