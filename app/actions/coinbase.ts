"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/User"

const COINBASE_API_URL = "https://api.commerce.coinbase.com"

interface CoinbaseCharge {
  id: string
  name: string
  description: string
  pricing_type: "fixed_price"
  local_price: {
    amount: string
    currency: string
  }
  metadata: {
    user_id: string
    plan: string
  }
  redirect_url?: string
  cancel_url?: string
}

export async function createCoinbaseCharge(
  userId: string,
  planName: string,
  amount: number,
  currency: string = "USD"
) {
  try {
    const charge: CoinbaseCharge = {
      id: "",
      name: `${planName} Plan`,
      description: `FastReado ${planName} subscription`,
      pricing_type: "fixed_price",
      local_price: {
        amount: amount.toString(),
        currency: currency
      },
      metadata: {
        user_id: userId,
        plan: planName
      },
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`
    }

    const response = await fetch(`${COINBASE_API_URL}/charges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": process.env.COINBASE_COMMERCE_API_KEY!,
        "X-CC-Version": "2018-03-22"
      },
      body: JSON.stringify(charge)
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Coinbase API error: ${error}`)
    }

    const result = await response.json()
    return { success: true, data: result.data }
  } catch (error) {
    console.error("Coinbase charge creation error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function handleCoinbaseWebhook(event: any) {
  try {
    await connectToDatabase()

    switch (event.type) {
      case "charge:confirmed": {
        const charge = event.data
        const userId = charge.metadata?.user_id
        const plan = charge.metadata?.plan

        if (!userId || !plan) {
          console.error("Missing user_id or plan in Coinbase webhook metadata")
          return { success: false, error: "Missing metadata" }
        }

        // Kullanıcıyı premium yap
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          premiumPlan: plan,
          premiumStartDate: new Date(),
          premiumEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
          paymentProvider: "coinbase",
          paymentId: charge.id
        })

        console.log(`User ${userId} upgraded to ${plan} via Coinbase`)
        return { success: true }
      }

      case "charge:failed": {
        const charge = event.data
        console.log(`Coinbase payment failed: ${charge.id}`)
        return { success: true }
      }

      default:
        console.log(`Unhandled Coinbase event: ${event.type}`)
        return { success: true }
    }
  } catch (error) {
    console.error("Coinbase webhook processing error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}