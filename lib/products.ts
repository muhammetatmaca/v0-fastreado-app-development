export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
  pdfLimit: number | null // null means unlimited
  hasAIFeatures: boolean
}

// This is the source of truth for all subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Ücretsiz",
    description: "Başlamak için ideal",
    priceInCents: 0,
    features: ["Ayda 2 PDF", "RSVP okuma modu", "Bionic okuma modu", "Temel özellikler"],
    pdfLimit: 2,
    hasAIFeatures: false,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Sınırsız okuma deneyimi",
    priceInCents: 4999, // 49.99 TRY/month
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
  },
]

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId)
}
