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
// Lemon Squeezy ve Crypto ödeme entegrasyonu için

export default function Checkout({ planId }: { planId: string }) {
  const [paymentMethod, setPaymentMethod] = useState<'lemon' | 'stripe' | 'paddle' | 'freemius' | 'polar' | 'revenuecat' | 'crypto' | 'googleplay' | 'demo'>('lemon')
  const { language } = useTranslation()
  const plan = getPlanById(planId)
  const router = useRouter()

  if (!plan) {
    return <div>{language === 'tr' ? 'Plan bulunamadı' : 'Plan not found'}</div>
  }

  const planPrice = getPlanPrice(plan, language)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          {language === 'tr' ? 'Ödeme Yöntemi Seçin' : 'Choose Payment Method'}
        </h3>
        <p className="text-muted-foreground">
          {plan.name} - {planPrice.symbol}{planPrice.price.toFixed(2)}/{language === 'tr' ? 'ay' : 'month'}
        </p>
      </div>

      {/* Payment Method Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
        <Card 
          className={`p-4 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'lemon' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('lemon')}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🍋</span>
            </div>
            <h4 className="font-semibold mb-1">Lemon Squeezy</h4>
            <p className="text-sm text-muted-foreground">
              {language === 'tr' ? 'Kredi kartı, PayPal' : 'Credit card, PayPal'}
            </p>
          </div>
        </Card>

        <Card 
          className={`p-4 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('stripe')}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💳</span>
            </div>
            <h4 className="font-semibold mb-1">Stripe</h4>
            <p className="text-sm text-muted-foreground">
              {language === 'tr' ? 'Kredi kartı, Apple Pay' : 'Credit card, Apple Pay'}
            </p>
          </div>
        </Card>

        <Card 
          className={`p-4 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'crypto' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('crypto')}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">₿</span>
            </div>
            <h4 className="font-semibold mb-1">
              {language === 'tr' ? 'Kripto Para' : 'Cryptocurrency'}
            </h4>
            <p className="text-sm text-muted-foreground">
              Bitcoin, Ethereum, USDC
            </p>
          </div>
        </Card>

        <Card 
          className={`p-4 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'paddle' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('paddle')}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏓</span>
            </div>
            <h4 className="font-semibold mb-1">Paddle</h4>
            <p className="text-sm text-muted-foreground">
              {language === 'tr' ? 'Global ödeme sistemi' : 'Global payment system'}
            </p>
          </div>
        </Card>

        <Card 
          className={`p-3 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'freemius' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('freemius')}
        >
          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🚀</span>
            </div>
            <h4 className="font-semibold mb-1 text-sm">Freemius</h4>
            <p className="text-xs text-muted-foreground">
              {language === 'tr' ? 'SaaS özel' : 'SaaS focused'}
            </p>
          </div>
        </Card>

        <Card 
          className={`p-3 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'polar' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('polar')}
        >
          <div className="text-center">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🐻‍❄️</span>
            </div>
            <h4 className="font-semibold mb-1 text-sm">Polar</h4>
            <p className="text-xs text-muted-foreground">
              {language === 'tr' ? 'Dev odaklı' : 'Dev focused'}
            </p>
          </div>
        </Card>

        <Card 
          className={`p-3 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'revenuecat' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('revenuecat')}
        >
          <div className="text-center">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🐱</span>
            </div>
            <h4 className="font-semibold mb-1 text-sm">RevenueCat</h4>
            <p className="text-xs text-muted-foreground">
              {language === 'tr' ? 'Abonelik' : 'Subscription'}
            </p>
          </div>
        </Card>

        <Card 
          className={`p-3 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'googleplay' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('googleplay')}
        >
          <div className="text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">📱</span>
            </div>
            <h4 className="font-semibold mb-1 text-sm">Google Play</h4>
            <p className="text-xs text-muted-foreground">
              {language === 'tr' ? 'Mobil ödeme' : 'Mobile payment'}
            </p>
          </div>
        </Card>

        <Card 
          className={`p-3 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'demo' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('demo')}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎮</span>
            </div>
            <h4 className="font-semibold mb-1">Demo</h4>
            <p className="text-sm text-muted-foreground">
              {language === 'tr' ? 'Test amaçlı' : 'For testing'}
            </p>
          </div>
        </Card>
      </div>

      {/* Payment Component */}
      {paymentMethod === 'lemon' && <LemonSqueezyCheckout planId={planId} />}
      {paymentMethod === 'stripe' && <StripeCheckout planId={planId} />}
      {paymentMethod === 'paddle' && <PaddleCheckout planId={planId} />}
      {paymentMethod === 'freemius' && <FreemiusCheckout planId={planId} />}
      {paymentMethod === 'polar' && <PolarCheckout planId={planId} />}
      {paymentMethod === 'revenuecat' && <RevenueCatCheckout planId={planId} />}
      {paymentMethod === 'crypto' && <CryptoCheckout planId={planId} />}
      {paymentMethod === 'googleplay' && <GooglePlayCheckout planId={planId} />}
      {paymentMethod === 'demo' && <DemoCheckout planId={planId} />}
    </div>
  )
}

// Lemon Squeezy Checkout Component
function LemonSqueezyCheckout({ planId }: { planId: string }) {
  const { language } = useTranslation()
  const plan = getPlanById(planId)!
  const planPrice = getPlanPrice(plan, language)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleLemonSqueezyCheckout = async () => {
    setIsProcessing(true)
    
    try {
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (!user.id || !user.email) {
        throw new Error('User information not found')
      }
      
      // Import Lemon Squeezy function dynamically
      const { createLemonSqueezyCheckout } = await import('@/app/actions/lemonsqueezy')
      
      // Create checkout session
      const result = await createLemonSqueezyCheckout(planId, user.id, user.email)
      
      if (result.success && result.checkoutUrl) {
        // Open checkout in new window
        window.open(result.checkoutUrl, '_blank', 'width=800,height=600')
        
        // Show success message after a delay
        setTimeout(() => {
          setIsSuccess(true)
          setTimeout(() => {
            router.push('/library?upgraded=true')
          }, 2000)
        }, 3000)
      } else {
        throw new Error(result.error || 'Failed to create checkout')
      }
      
    } catch (error) {
      console.error('Lemon Squeezy checkout error:', error)
      alert(language === 'tr' 
        ? 'Ödeme sayfası oluşturulamadı. Lütfen tekrar deneyin.'
        : 'Failed to create checkout. Please try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          {language === 'tr' ? 'Ödeme Tamamlandı!' : 'Payment Completed!'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {language === 'tr' 
            ? `${plan.name} planına başarıyla yükseltildiniz.`
            : `Successfully upgraded to ${plan.name} plan.`
          }
        </p>
        <p className="text-sm text-muted-foreground">
          {language === 'tr' 
            ? 'Kütüphane sayfasına yönlendiriliyorsunuz...'
            : 'Redirecting to library...'
          }
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🍋</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">Lemon Squeezy</h3>
      <p className="text-muted-foreground mb-6">
        {language === 'tr' 
          ? 'Güvenli ödeme için Lemon Squeezy\'ye yönlendirileceksiniz'
          : 'You will be redirected to Lemon Squeezy for secure payment'
        }
      </p>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>{plan.name}</span>
          <span className="font-semibold">{planPrice.symbol}{planPrice.price.toFixed(2)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {language === 'tr' ? 'Aylık abonelik' : 'Monthly subscription'}
        </div>
      </div>

      <Button 
        onClick={handleLemonSqueezyCheckout} 
        className="w-full" 
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {language === 'tr' ? 'Hazırlanıyor...' : 'Preparing...'}
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            {language === 'tr' ? 'Lemon Squeezy ile Öde' : 'Pay with Lemon Squeezy'}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        {language === 'tr' 
          ? 'Kredi kartı, PayPal ve diğer ödeme yöntemleri kabul edilir'
          : 'Credit card, PayPal and other payment methods accepted'
        }
      </p>
    </Card>
  )
}

// Stripe Checkout Component
function StripeCheckout({ planId }: { planId: string }) {
  const { language } = useTranslation()
  const plan = getPlanById(planId)!
  const planPrice = getPlanPrice(plan, language)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleStripeCheckout = async () => {
    setIsProcessing(true)
    
    try {
      // Import Stripe function dynamically
      const { startCheckoutSession } = await import('@/app/actions/stripe')
      
      // Create checkout session
      const clientSecret = await startCheckoutSession(planId)
      
      if (clientSecret) {
        // Stripe Checkout sayfasına yönlendir
        const checkoutUrl = `https://checkout.stripe.com/c/pay/${clientSecret.split('_secret_')[0]}`
        window.open(checkoutUrl, '_blank', 'width=800,height=600')
        
        // Show success message after a delay
        setTimeout(() => {
          setIsSuccess(true)
          setTimeout(() => {
            router.push('/library?upgraded=true')
          }, 2000)
        }, 3000)
      } else {
        throw new Error('Failed to create checkout session')
      }
      
    } catch (error) {
      console.error('Stripe checkout error:', error)
      alert(language === 'tr' 
        ? 'Ödeme sayfası oluşturulamadı. Lütfen tekrar deneyin.'
        : 'Failed to create checkout. Please try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          {language === 'tr' ? 'Ödeme Başlatıldı!' : 'Payment Initiated!'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {language === 'tr' 
            ? `Stripe ödeme sayfasına yönlendirildiniz. ${plan.name} planına yükseltme işleminizi tamamlayın.`
            : `Redirected to Stripe payment page. Complete your upgrade to ${plan.name} plan.`
          }
        </p>
        <p className="text-sm text-muted-foreground">
          {language === 'tr' 
            ? 'Kütüphane sayfasına yönlendiriliyorsunuz...'
            : 'Redirecting to library...'
          }
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">💳</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">Stripe</h3>
      <p className="text-muted-foreground mb-6">
        {language === 'tr' 
          ? 'Dünyanın en güvenilir ödeme sistemi'
          : 'World\'s most trusted payment system'
        }
      </p>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>{plan.name}</span>
          <span className="font-semibold">{planPrice.symbol}{planPrice.price.toFixed(2)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {language === 'tr' ? 'Aylık abonelik' : 'Monthly subscription'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">💳</div>
          <div className="text-xs">{language === 'tr' ? 'Kredi Kartı' : 'Credit Card'}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">🍎</div>
          <div className="text-xs">Apple Pay</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">🤖</div>
          <div className="text-xs">Google Pay</div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🔒</span>
          <span className="font-semibold text-purple-700">Stripe</span>
        </div>
        <p className="text-sm text-purple-600">
          {language === 'tr' 
            ? 'Milyonlarca işletme tarafından güvenilen ödeme altyapısı'
            : 'Payment infrastructure trusted by millions of businesses'
          }
        </p>
      </div>

      <Button 
        onClick={handleStripeCheckout} 
        className="w-full" 
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {language === 'tr' ? 'Hazırlanıyor...' : 'Preparing...'}
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            {language === 'tr' ? 'Stripe ile Öde' : 'Pay with Stripe'}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        {language === 'tr' 
          ? 'PCI DSS Level 1 sertifikalı • 256-bit SSL şifreleme • Dünya çapında kabul'
          : 'PCI DSS Level 1 certified • 256-bit SSL encryption • Accepted worldwide'
        }
      </p>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          {language === 'tr' 
            ? '💡 Stripe, en düşük komisyon oranları ile güvenli ödeme sunar (%2.9 + $0.30)'
            : '💡 Stripe offers secure payments with the lowest commission rates (2.9% + $0.30)'
          }
        </p>
      </div>
    </Card>
  )
}

// Paddle Checkout Component
function PaddleCheckout({ planId }: { planId: string }) {
  const { language } = useTranslation()
  const plan = getPlanById(planId)!
  const planPrice = getPlanPrice(plan, language)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePaddleCheckout = async () => {
    setIsProcessing(true)
    
    try {
      // Paddle.js entegrasyonu burada olacak
      // Şimdilik demo URL
      const checkoutUrl = `https://checkout.paddle.com/checkout?product=${planId}&locale=${language}`
      
      // Yeni pencerede aç
      window.open(checkoutUrl, '_blank', 'width=800,height=600')
      
      setTimeout(() => {
        setIsProcessing(false)
      }, 1000)
      
    } catch (error) {
      console.error('Paddle checkout error:', error)
      setIsProcessing(false)
    }
  }

  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🏓</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">Paddle</h3>
      <p className="text-muted-foreground mb-6">
        {language === 'tr' 
          ? 'Global ödeme sistemi ile güvenli ödeme'
          : 'Secure payment with global payment system'
        }
      </p>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>{plan.name}</span>
          <span className="font-semibold">{planPrice.symbol}{planPrice.price.toFixed(2)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {language === 'tr' ? 'Aylık abonelik' : 'Monthly subscription'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">💳</div>
          <div className="text-xs">{language === 'tr' ? 'Kredi Kartı' : 'Credit Card'}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">🏦</div>
          <div className="text-xs">PayPal</div>
        </div>
      </div>

      <Button 
        onClick={handlePaddleCheckout} 
        className="w-full" 
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {language === 'tr' ? 'Yönlendiriliyor...' : 'Redirecting...'}
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            {language === 'tr' ? 'Paddle ile Öde' : 'Pay with Paddle'}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        {language === 'tr' 
          ? 'Vergi yönetimi dahil • 200+ ülkede kabul edilir'
          : 'Tax management included • Accepted in 200+ countries'
        }
      </p>
    </Card>
  )
}

// Freemius Checkout Component
function FreemiusCheckout({ planId }: { planId: string }) {
  const { language } = useTranslation()
  const plan = getPlanById(planId)!
  const planPrice = getPlanPrice(plan, language)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleFreemiusCheckout = async () => {
    setIsProcessing(true)
    
    try {
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (!user.id || !user.email) {
        throw new Error('User information not found')
      }
      
      // Import Freemius function dynamically
      const { createFreemiusCheckout } = await import('@/app/actions/freemius')
      
      // Create checkout session
      const result = await createFreemiusCheckout(planId, user.id, user.email, language)
      
      if (result.success && result.checkoutUrl) {
        // Open checkout in new window
        window.open(result.checkoutUrl, '_blank', 'width=800,height=600')
        
        // Show success message after a delay
        setTimeout(() => {
          setIsSuccess(true)
          setTimeout(() => {
            router.push('/library?upgraded=true')
          }, 2000)
        }, 3000)
      } else {
        throw new Error(result.error || 'Failed to create checkout')
      }
      
    } catch (error) {
      console.error('Freemius checkout error:', error)
      alert(language === 'tr' 
        ? 'Ödeme sayfası oluşturulamadı. Lütfen tekrar deneyin.'
        : 'Failed to create checkout. Please try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          {language === 'tr' ? 'Ödeme Başlatıldı!' : 'Payment Initiated!'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {language === 'tr' 
            ? `Freemius ödeme sayfasına yönlendirildiniz. ${plan.name} planına yükseltme işleminizi tamamlayın.`
            : `Redirected to Freemius payment page. Complete your upgrade to ${plan.name} plan.`
          }
        </p>
        <p className="text-sm text-muted-foreground">
          {language === 'tr' 
            ? 'Kütüphane sayfasına yönlendiriliyorsunuz...'
            : 'Redirecting to library...'
          }
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🚀</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">Freemius</h3>
      <p className="text-muted-foreground mb-6">
        {language === 'tr' 
          ? 'SaaS ürünleri için özel ödeme sistemi'
          : 'Payment system specialized for SaaS products'
        }
      </p>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>{plan.name}</span>
          <span className="font-semibold">{planPrice.symbol}{planPrice.price.toFixed(2)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {language === 'tr' ? 'Aylık abonelik' : 'Monthly subscription'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">💳</div>
          <div className="text-xs">{language === 'tr' ? 'Kredi Kartı' : 'Credit Card'}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">🏦</div>
          <div className="text-xs">PayPal</div>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🚀</span>
          <span className="font-semibold text-green-700">Freemius</span>
        </div>
        <p className="text-sm text-green-600">
          {language === 'tr' 
            ? 'SaaS ürünleri için özel olarak tasarlanmış güvenli ödeme sistemi'
            : 'Secure payment system designed specifically for SaaS products'
          }
        </p>
      </div>

      <Button 
        onClick={handleFreemiusCheckout} 
        className="w-full" 
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {language === 'tr' ? 'Hazırlanıyor...' : 'Preparing...'}
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            {language === 'tr' ? 'Freemius ile Öde' : 'Pay with Freemius'}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        {language === 'tr' 
          ? 'SaaS abonelik yönetimi • Otomatik faturalandırma • Güvenli ödeme'
          : 'SaaS subscription management • Automatic billing • Secure payment'
        }
      </p>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          {language === 'tr' 
            ? '💡 Freemius, WordPress ve SaaS ürünleri için optimize edilmiş ödeme sistemidir'
            : '💡 Freemius is a payment system optimized for WordPress and SaaS products'
          }
        </p>
      </div>
    </Card>
  )
}

// Polar.sh Checkout Component
function PolarCheckout({ planId }: { planId: string }) {
  const { language } = useTranslation()
  const plan = getPlanById(planId)!
  const planPrice = getPlanPrice(plan, language)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handlePolarCheckout = async () => {
    setIsProcessing(true)
    
    try {
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (!user.id || !user.email) {
        throw new Error('User information not found')
      }
      
      // Import Polar function dynamically
      const { createPolarCheckout } = await import('@/app/actions/polar')
      
      // Create checkout session
      const result = await createPolarCheckout(planId, user.id, user.email, language)
      
      if (result.success && result.checkoutUrl) {
        // Open checkout in new window
        window.open(result.checkoutUrl, '_blank', 'width=800,height=600')
        
        // Show success message after a delay
        setTimeout(() => {
          setIsSuccess(true)
          setTimeout(() => {
            router.push('/library?upgraded=true')
          }, 2000)
        }, 3000)
      } else {
        throw new Error(result.error || 'Failed to create checkout')
      }
      
    } catch (error) {
      console.error('Polar checkout error:', error)
      alert(language === 'tr' 
        ? 'Ödeme sayfası oluşturulamadı. Lütfen tekrar deneyin.'
        : 'Failed to create checkout. Please try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          {language === 'tr' ? 'Ödeme Başlatıldı!' : 'Payment Initiated!'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {language === 'tr' 
            ? `Polar.sh ödeme sayfasına yönlendirildiniz. ${plan.name} planına yükseltme işleminizi tamamlayın.`
            : `Redirected to Polar.sh payment page. Complete your upgrade to ${plan.name} plan.`
          }
        </p>
        <p className="text-sm text-muted-foreground">
          {language === 'tr' 
            ? 'Kütüphane sayfasına yönlendiriliyorsunuz...'
            : 'Redirecting to library...'
          }
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🐻‍❄️</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">Polar.sh</h3>
      <p className="text-muted-foreground mb-6">
        {language === 'tr' 
          ? 'Açık kaynak geliştiriciler için modern ödeme sistemi'
          : 'Modern payment system for open source developers'
        }
      </p>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>{plan.name}</span>
          <span className="font-semibold">{planPrice.symbol}{planPrice.price.toFixed(2)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {language === 'tr' ? 'Aylık abonelik' : 'Monthly subscription'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">💳</div>
          <div className="text-xs">{language === 'tr' ? 'Kredi Kartı' : 'Credit Card'}</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">🐙</div>
          <div className="text-xs">GitHub</div>
        </div>
      </div>

      <div className="bg-cyan-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🐻‍❄️</span>
          <span className="font-semibold text-cyan-700">Polar.sh</span>
        </div>
        <p className="text-sm text-cyan-600">
          {language === 'tr' 
            ? 'GitHub entegrasyonu ile açık kaynak projeleri için özel tasarlanmış ödeme sistemi'
            : 'Payment system designed specifically for open source projects with GitHub integration'
          }
        </p>
      </div>

      <Button 
        onClick={handlePolarCheckout} 
        className="w-full" 
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {language === 'tr' ? 'Hazırlanıyor...' : 'Preparing...'}
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 mr-2" />
            {language === 'tr' ? 'Polar ile Öde' : 'Pay with Polar'}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        {language === 'tr' 
          ? 'GitHub entegrasyonu • Developer friendly • Açık kaynak odaklı'
          : 'GitHub integration • Developer friendly • Open source focused'
        }
      </p>
      
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <p className="text-xs text-purple-700">
          {language === 'tr' 
            ? '💡 Polar.sh, GitHub sponsorları ve açık kaynak projeleri için optimize edilmiştir'
            : '💡 Polar.sh is optimized for GitHub sponsors and open source projects'
          }
        </p>
      </div>
    </Card>
  )
}

// RevenueCat Checkout Component
function RevenueCatCheckout({ planId }: { planId: string }) {
  const { language } = useTranslation()
  const plan = getPlanById(planId)!
  const planPrice = getPlanPrice(plan, language)

  const handleRevenueCatCheckout = () => {
    // RevenueCat web checkout (genellikle mobil için kullanılır)
    alert(language === 'tr' 
      ? 'RevenueCat genellikle mobil uygulamalar için kullanılır. Web entegrasyonu yakında!'
      : 'RevenueCat is typically used for mobile apps. Web integration coming soon!'
    )
  }

  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🐱</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">RevenueCat</h3>
      <p className="text-muted-foreground mb-6">
        {language === 'tr' 
          ? 'Mobil abonelik yönetimi sistemi'
          : 'Mobile subscription management system'
        }
      </p>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>{plan.name}</span>
          <span className="font-semibold">{planPrice.symbol}{planPrice.price.toFixed(2)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {language === 'tr' ? 'Aylık abonelik' : 'Monthly subscription'}
        </div>
      </div>

      <Button onClick={handleRevenueCatCheckout} className="w-full" size="lg">
        <Lock className="w-4 h-4 mr-2" />
        {language === 'tr' ? 'RevenueCat ile Öde' : 'Pay with RevenueCat'}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        {language === 'tr' 
          ? 'iOS/Android abonelik yönetimi • Cross-platform'
          : 'iOS/Android subscription management • Cross-platform'
        }
      </p>
    </Card>
  )
}

// Google Play Checkout Component
function GooglePlayCheckout({ planId }: { planId: string }) {
  const { language } = useTranslation()
  const plan = getPlanById(planId)!
  const planPrice = getPlanPrice(plan, language)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleGooglePlayPurchase = async () => {
    setIsProcessing(true)
    
    try {
      // Import Google Play functions dynamically
      const { purchaseGooglePlayProduct, initializeGooglePlayBilling } = await import('@/app/actions/google-play')
      
      // Initialize billing if needed
      await initializeGooglePlayBilling()
      
      // Map planId to Google Play product ID
      const googlePlayProductId = planId === 'premium' ? 'fastreado_premium_monthly' : 'fastreado_premium_yearly'
      
      // Purchase the product
      const result = await purchaseGooglePlayProduct(googlePlayProductId)
      
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/library?upgraded=true')
        }, 2000)
      } else {
        throw new Error(result.error || 'Purchase failed')
      }
      
    } catch (error) {
      console.error('Google Play purchase error:', error)
      alert(language === 'tr' 
        ? 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.'
        : 'Payment failed. Please try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          {language === 'tr' ? 'Ödeme Başarılı!' : 'Payment Successful!'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {language === 'tr' 
            ? `${plan.name} planına başarıyla yükseltildiniz.`
            : `Successfully upgraded to ${plan.name} plan.`
          }
        </p>
        <p className="text-sm text-muted-foreground">
          {language === 'tr' 
            ? 'Kütüphane sayfasına yönlendiriliyorsunuz...'
            : 'Redirecting to library...'
          }
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">📱</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">Google Play</h3>
      <p className="text-muted-foreground mb-6">
        {language === 'tr' 
          ? 'Google Play Store üzerinden güvenli ödeme'
          : 'Secure payment through Google Play Store'
        }
      </p>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>{plan.name}</span>
          <span className="font-semibold">{planPrice.symbol}{planPrice.price.toFixed(2)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {language === 'tr' ? 'Aylık abonelik' : 'Monthly subscription'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">💳</div>
          <div className="text-xs">{language === 'tr' ? 'Google Pay' : 'Google Pay'}</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">📱</div>
          <div className="text-xs">{language === 'tr' ? 'Mobil Ödeme' : 'Mobile Payment'}</div>
        </div>
      </div>

      <Button 
        onClick={handleGooglePlayPurchase} 
        className="w-full" 
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {language === 'tr' ? 'İşleniyor...' : 'Processing...'}
          </>
        ) : (
          <>
            <span className="mr-2">📱</span>
            {language === 'tr' ? 'Google Play ile Öde' : 'Pay with Google Play'}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        {language === 'tr' 
          ? 'Google Play Store güvencesi • Otomatik abonelik yönetimi'
          : 'Google Play Store guarantee • Automatic subscription management'
        }
      </p>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          {language === 'tr' 
            ? '💡 Bu özellik mobil uygulamada daha iyi çalışır'
            : '💡 This feature works better in the mobile app'
          }
        </p>
      </div>
    </Card>
  )
}

// Crypto Checkout Component
function CryptoCheckout({ planId }: { planId: string }) {
  const { language } = useTranslation()
  const plan = getPlanById(planId)!
  const planPrice = getPlanPrice(plan, language)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleCryptoPayment = async () => {
    setIsProcessing(true)
    
    try {
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (!user.id || !user.email) {
        throw new Error('User information not found')
      }
      
      // Import Coinbase function dynamically
      const { createCoinbaseCharge } = await import('@/app/actions/coinbase')
      
      // Create Coinbase charge
      const result = await createCoinbaseCharge(
        user.id,
        plan.name,
        planPrice.price,
        'USD'
      )
      
      if (result.success && result.data) {
        // Open Coinbase Commerce checkout in new window
        window.open(result.data.hosted_url, '_blank', 'width=800,height=600')
        
        // Show success message after a delay
        setTimeout(() => {
          setIsSuccess(true)
          setTimeout(() => {
            router.push('/library?upgraded=true')
          }, 2000)
        }, 3000)
      } else {
        throw new Error(result.error || 'Failed to create crypto payment')
      }
      
    } catch (error) {
      console.error('Crypto payment error:', error)
      alert(language === 'tr' 
        ? 'Kripto ödeme oluşturulamadı. Lütfen tekrar deneyin.'
        : 'Failed to create crypto payment. Please try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          {language === 'tr' ? 'Ödeme Başlatıldı!' : 'Payment Initiated!'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {language === 'tr' 
            ? 'Kripto ödemeniz başarıyla oluşturuldu. Coinbase Commerce sayfasında ödemeyi tamamlayın.'
            : 'Your crypto payment was successfully created. Complete the payment on Coinbase Commerce page.'
          }
        </p>
        <p className="text-sm text-muted-foreground">
          {language === 'tr' 
            ? 'Kütüphane sayfasına yönlendiriliyorsunuz...'
            : 'Redirecting to library...'
          }
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">₿</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {language === 'tr' ? 'Kripto Para Ödemesi' : 'Cryptocurrency Payment'}
      </h3>
      <p className="text-muted-foreground mb-6">
        {language === 'tr' 
          ? 'Bitcoin, Ethereum, USDC ve diğer kripto paralar ile ödeme yapın'
          : 'Pay with Bitcoin, Ethereum, USDC and other cryptocurrencies'
        }
      </p>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>{plan.name}</span>
          <span className="font-semibold">
            ${planPrice.price.toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          {language === 'tr' ? 'Aylık abonelik' : 'Monthly subscription'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">₿</div>
          <div className="text-xs">Bitcoin</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">Ξ</div>
          <div className="text-xs">Ethereum</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-lg mb-1">$</div>
          <div className="text-xs">USDC</div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🔒</span>
          <span className="font-semibold text-blue-700">Coinbase Commerce</span>
        </div>
        <p className="text-sm text-blue-600">
          {language === 'tr' 
            ? 'Güvenli kripto ödeme işlemi için Coinbase Commerce kullanıyoruz'
            : 'We use Coinbase Commerce for secure crypto payments'
          }
        </p>
      </div>

      <Button 
        onClick={handleCryptoPayment} 
        className="w-full" 
        size="lg"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {language === 'tr' ? 'Ödeme oluşturuluyor...' : 'Creating payment...'}
          </>
        ) : (
          <>
            <span className="mr-2">₿</span>
            {language === 'tr' ? 'Kripto ile Öde' : 'Pay with Crypto'}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        {language === 'tr' 
          ? 'Güvenli blockchain ödemesi • Düşük işlem ücreti • Anında onay'
          : 'Secure blockchain payment • Low transaction fees • Instant confirmation'
        }
      </p>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-xs text-yellow-700">
          {language === 'tr' 
            ? '💡 Ödeme tamamlandıktan sonra hesabınız otomatik olarak premium\'a yükseltilecektir'
            : '💡 Your account will be automatically upgraded to premium after payment completion'
          }
        </p>
      </div>
    </Card>
  )
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
