"use server"

import { SUBSCRIPTION_PLANS, getPlanPrice } from "@/lib/products"

export async function createLemonSqueezyCheckout(planId: string, language: string = 'tr') {
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)

  if (!plan || plan.id === "free") {
    throw new Error(`Invalid plan: "${planId}"`)
  }

  const planPrice = getPlanPrice(plan, language)

  try {
    // Lemon Squeezy API ile checkout session oluştur
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            product_options: {
              name: plan.name,
              description: plan.description,
              media: [],
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/library?upgraded=true`,
              receipt_button_text: language === 'tr' ? 'Kütüphaneye Git' : 'Go to Library',
              receipt_link_url: `${process.env.NEXT_PUBLIC_APP_URL}/library`,
            },
            checkout_options: {
              embed: true,
              media: false,
              logo: true,
            },
            checkout_data: {
              email: '', // Kullanıcı email'i buraya gelecek
              name: '',  // Kullanıcı adı buraya gelecek
              billing_address: {},
              tax_number: '',
              discount_code: '',
              custom: {
                user_id: '', // Kullanıcı ID'si buraya gelecek
                plan_id: planId,
                language: language,
              },
            },
            expires_at: null,
            preview: true,
            test_mode: process.env.NODE_ENV !== 'production',
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: process.env.LEMONSQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: planId === 'premium' ? 'premium_variant_id' : 'basic_variant_id', // Gerçek variant ID'leri buraya
              },
            },
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Lemon Squeezy API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data.attributes.url

  } catch (error) {
    console.error("Lemon Squeezy checkout creation failed:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function getLemonSqueezyProducts() {
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/products', {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Lemon Squeezy API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data

  } catch (error) {
    console.error("Failed to fetch Lemon Squeezy products:", error)
    return []
  }
}