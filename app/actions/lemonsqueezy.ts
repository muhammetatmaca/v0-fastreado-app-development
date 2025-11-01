"use server"

import { SUBSCRIPTION_PLANS } from '@/lib/products'

// Product variant mapping - Lemon Squeezy'den alınan gerçek ID'ler
const VARIANT_IDS = {
  premium: '1066466', // FASTREADO PRO - Monthly - Product ID: 678363
  yearly: '1066466'   // Şimdilik aynı variant, yearly eklenirse güncellenecek
}

export async function createLemonSqueezyCheckout(planId: string, userId: string, userEmail: string) {
  try {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
    if (!plan || plan.id === 'free') {
      throw new Error(`Invalid plan: "${planId}"`)
    }

    const variantId = VARIANT_IDS[planId as keyof typeof VARIANT_IDS]
    if (!variantId) {
      throw new Error(`No variant ID found for plan: ${planId}`)
    }

    // Use direct API call instead of SDK for better control
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
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/library?upgraded=true`,
              receipt_button_text: 'Kütüphaneye Git',
              receipt_thank_you_note: 'Fastreado Premium\'a hoş geldiniz!',
            },
            checkout_options: {
              embed: true,
              media: false,
              logo: true,
            },
            checkout_data: {
              email: userEmail,
              custom: {
                user_id: userId,
                plan_id: planId
              },
            },
            expires_at: null,
            preview: false,
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
                id: variantId,
              },
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Lemon Squeezy API error:', errorData)
      throw new Error(`Lemon Squeezy API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      checkoutUrl: data.data.attributes.url
    }
  } catch (error) {
    console.error('Lemon Squeezy checkout error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    }
  }
}

export async function getLemonSqueezyProducts() {
  try {
    const response = await fetch(`https://api.lemonsqueezy.com/v1/products?filter[store_id]=${process.env.LEMONSQUEEZY_STORE_ID}`, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Lemon Squeezy API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      products: data.data || []
    }
  } catch (error) {
    console.error('Get Lemon Squeezy products error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get products'
    }
  }
}

export async function handleLemonSqueezyWebhook(eventName: string, payload: any) {
  try {
    console.log('Lemon Squeezy webhook received:', eventName, payload)

    const { data } = payload
    const customData = data.attributes.first_subscription_item?.subscription?.custom_data || 
                      data.attributes.custom_data || {}
    const userId = customData.user_id
    const planId = customData.plan_id

    if (!userId) {
      console.error('No user ID found in webhook payload')
      return { success: false, error: 'No user ID found' }
    }

    // Dynamic import to avoid connection issues
    const { connectDB } = await import('@/lib/mongodb')
    const { User } = await import('@/models/User')

    await connectDB()
    const user = await User.findById(userId)

    if (!user) {
      console.error('User not found:', userId)
      return { success: false, error: 'User not found' }
    }

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_payment_success':
        // Upgrade user to premium
        user.plan = 'premium'
        
        // Add purchase record
        if (!user.purchases) {
          user.purchases = []
        }
        
        user.purchases.push({
          provider: 'lemonsqueezy',
          productId: planId || 'premium',
          purchaseToken: data.id,
          orderId: data.attributes.order_id?.toString(),
          purchaseTime: new Date(data.attributes.created_at || new Date()),
          amount: data.attributes.subtotal ? data.attributes.subtotal / 100 : 0,
          currency: data.attributes.currency || 'USD',
          status: 'completed'
        })
        
        await user.save()
        console.log('User upgraded to premium:', userId, 'Event:', eventName)
        break

      case 'subscription_cancelled':
      case 'subscription_expired':
        // Downgrade user to free
        user.plan = 'free'
        await user.save()
        console.log('User downgraded to free:', userId, 'Event:', eventName)
        break

      case 'subscription_payment_failed':
        // Ödeme başarısız - kullanıcıyı uyar ama hemen downgrade etme
        console.log('Payment failed for user:', userId)
        // İsteğe bağlı: E-posta gönder veya kullanıcıyı bilgilendir
        break

      case 'subscription_payment_recovered':
        // Ödeme kurtarıldı - kullanıcı premium'da kalabilir
        user.plan = 'premium'
        await user.save()
        console.log('Payment recovered for user:', userId)
        break

      case 'subscription_payment_refunded':
        // Ödeme iade edildi - kullanıcıyı free'ye düşür
        user.plan = 'free'
        
        // Purchase record'u güncelle
        if (user.purchases) {
          const purchaseIndex = user.purchases.findIndex(p => 
            p.provider === 'lemonsqueezy' && p.purchaseToken === data.id
          )
          if (purchaseIndex !== -1) {
            user.purchases[purchaseIndex].status = 'refunded'
          }
        }
        
        await user.save()
        console.log('Payment refunded for user:', userId)
        break

      case 'order_created':
        // Handle one-time purchase if needed
        console.log('Order created:', data.id)
        break

      default:
        console.log('Unhandled webhook event:', eventName)
    }

    return {
      success: true,
      message: 'Webhook processed successfully'
    }
  } catch (error) {
    console.error('Lemon Squeezy webhook error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process webhook'
    }
  }
}