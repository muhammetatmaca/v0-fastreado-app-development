"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock, CheckCircle } from "lucide-react"
import { getPlanById, getPlanPrice } from "@/lib/products"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/useTranslation"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckoutSession } from "@/app/actions/stripe"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

export default function Checkout({ planId }: { planId: string }) {
  const [showDemo, setShowDemo] = useState(!stripePromise)
  const { language } = useTranslation()
  const plan = getPlanById(planId)
  const router = useRouter()

  const startCheckoutSessionForPlan = useCallback(() => startCheckoutSession(planId), [planId])

  if (!plan) {
    return <div>{language === 'tr' ? 'Plan bulunamadı' : 'Plan not found'}</div>
  }

  const planPrice = getPlanPrice(plan, language)

  // Stripe gerçek entegrasyonu
  if (stripePromise && !showDemo) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-2">
            {language === 'tr' ? 'Güvenli Ödeme' : 'Secure Payment'}
          </h3>
          <p className="text-muted-foreground">
            {plan.name} - {planPrice.symbol}{planPrice.price.toFixed(2)}/{language === 'tr' ? 'ay' : 'month'}
          </p>
        </div>

        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret: startCheckoutSessionForPlan }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>

        <div className="text-center mt-6">
          <Button 
            variant="link" 
            onClick={() => setShowDemo(true)}
            className="text-sm text-muted-foreground"
          >
            {language === 'tr' ? 'Demo modunu dene' : 'Try demo mode'}
          </Button>
        </div>
      </div>
    )
  }

  // Demo checkout (Stripe anahtarları yoksa veya demo modu seçilmişse)
  return <DemoCheckout planId={planId} />
}

function DemoCheckout({ planId }: { planId: string }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const { language } = useTranslation()
  const plan = getPlanById(planId)!
  const planPrice = getPlanPrice(plan, language)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Demo ödeme işlemi simülasyonu
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      
      // 2 saniye sonra library'ye yönlendir
      setTimeout(() => {
        router.push('/library?upgraded=true')
      }, 2000)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Ödeme Başarılı!</h3>
        <p className="text-muted-foreground mb-4">
          {plan.name} planına başarıyla yükseltildiniz.
        </p>
        <p className="text-sm text-muted-foreground">
          Kütüphane sayfasına yönlendiriliyorsunuz...
        </p>
      </Card>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">
            {language === 'tr' ? 'Ödeme Bilgileri' : 'Payment Details'}
          </h3>
          <p className="text-muted-foreground">
            {plan.name} - {planPrice.symbol}{planPrice.price.toFixed(2)}/{language === 'tr' ? 'ay' : 'month'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              required
              disabled={isProcessing}
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">Kart Numarası</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                required
                disabled={isProcessing}
              />
              <CreditCard className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Son Kullanma</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                required
                disabled={isProcessing}
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                required
                disabled={isProcessing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name">Kart Üzerindeki İsim</Label>
            <Input
              id="name"
              placeholder="Ad Soyad"
              required
              disabled={isProcessing}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                İşleniyor...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
{language === 'tr' ? 'Öde' : 'Pay'} {planPrice.symbol}{planPrice.price.toFixed(2)}
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Bu bir demo ödeme sayfasıdır. Gerçek ödeme alınmaz.
            </p>
          </div>
        </form>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          İptal etmek için{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => router.back()}>
            geri dön
          </Button>
        </p>
      </div>
    </div>
  )
}
