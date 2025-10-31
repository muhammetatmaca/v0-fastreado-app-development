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
// Payment integration components

export default function Checkout({ planId }: { planId: string }) {
  const [paymentMethod, setPaymentMethod] = useState<'lemon' | 'googleplay'>('lemon')
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
        <Card 
          className={`p-6 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'lemon' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('lemon')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍋</span>
            </div>
            <h4 className="font-semibold mb-2 text-lg">Lemon Squeezy</h4>
            <p className="text-sm text-muted-foreground">
              {language === 'tr' ? 'Kredi kartı, PayPal, Apple Pay' : 'Credit card, PayPal, Apple Pay'}
            </p>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer border-2 transition-colors ${
            paymentMethod === 'googleplay' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onClick={() => setPaymentMethod('googleplay')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <h4 className="font-semibold mb-2 text-lg">Google Play</h4>
            <p className="text-sm text-muted-foreground">
              {language === 'tr' ? 'Mobil ödeme sistemi' : 'Mobile payment system'}
            </p>
          </div>
        </Card>




      </div>

      {/* Payment Component */}
      {paymentMethod === 'lemon' && <LemonSqueezyCheckout planId={planId} />}
      {paymentMethod === 'googleplay' && <GooglePlayCheckout planId={planId} />}
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
        
        // Sadece bilgilendirme mesajı göster, otomatik premium'a geçme
        alert(language === 'tr' 
          ? 'Ödeme sayfası açıldı. Ödemeyi tamamladıktan sonra hesabınız otomatik olarak premium\'a yükseltilecektir.'
          : 'Payment page opened. Your account will be automatically upgraded to premium after completing the payment.'
        )
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




