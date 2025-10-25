export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  priceInCents: number
  priceInCentsUSD: number
  features: string[]
  pdfLimit: number | null // null means unlimited
  hasAIFeatures: boolean
  googlePlayProductId?: string // Google Play Store product ID
}

// This is the source of truth for all subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Ücretsiz",
    description: "Başlamak için ideal",
    priceInCents: 0,
    priceInCentsUSD: 0,
    features: ["Ayda 2 PDF", "RSVP okuma modu", "Bionic okuma modu", "Temel özellikler"],
    pdfLimit: 2,
    hasAIFeatures: false,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Sınırsız okuma deneyimi",
    priceInCents: 9900, // 99.00 TRY/month
    priceInCentsUSD: 299, // 2.99 USD/month
    features: [
      "Sınırsız PDF",
      "RSVP okuma modu",
      "Bionic okuma modu",
      "AI özet oluşturma",
      "AI podcast senaryosu",
      "Öncelikli destek",
    ],
    pdfLimit: null,
    hasAIFeatures: true,
    googlePlayProductId: "fastreado_premium_monthly",
  },
]

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId)
}

export function getPlanPrice(plan: SubscriptionPlan, language: string = 'tr'): { price: number, currency: string, symbol: string } {
  if (language === 'en') {
    return {
      price: plan.priceInCentsUSD / 100,
      currency: 'USD',
      symbol: '$'
    }
  } else {
    return {
      price: plan.priceInCents / 100,
      currency: 'TRY',
      symbol: '₺'
    }
  }
}
