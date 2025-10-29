"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Zap, Crown } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"
import { SUBSCRIPTION_PLANS, getPlanPrice } from "@/lib/products"
import { usePremium } from "@/hooks/usePremium"

export default function PricingPage() {
  const { t, language } = useTranslation()
  const { isPremium, isExpired, endDate, daysLeft, loading } = usePremium()
  
  const freePlan = SUBSCRIPTION_PLANS.find(p => p.id === 'free')!
  const premiumPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'premium')!
  
  const premiumPrice = getPlanPrice(premiumPlan, language)
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/fastreado-logo.png" alt="Fastreado" className="h-8 w-auto logo-img" />
          </Link>
          <LanguageFlags />
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Premium Status Banner */}
          {!loading && isPremium && !isExpired && (
            <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-yellow-800">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">
                  {language === 'tr' 
                    ? `Premium üyesiniz! ${daysLeft} gün kaldı (${endDate?.toLocaleDateString('tr-TR')} tarihine kadar)`
                    : `You are a Premium member! ${daysLeft} days left (until ${endDate?.toLocaleDateString('en-US')})`
                  }
                </span>
              </div>
            </div>
          )}

          {/* Expired Premium Banner */}
          {!loading && isExpired && (
            <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-red-800">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">
                  {language === 'tr' 
                    ? 'Premium aboneliğinizin süresi doldu. Yeniden abone olun!'
                    : 'Your Premium subscription has expired. Subscribe again!'
                  }
                </span>
              </div>
            </div>
          )}

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-fragor">
              {language === 'tr' ? 'Basit ve şeffaf fiyatlandırma' : 'Simple and transparent pricing'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === 'tr' ? 'İhtiyacınıza uygun planı seçin' : 'Choose the plan that fits your needs'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 border-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 font-fragor">
                  {language === 'tr' ? 'Ücretsiz' : 'Free'}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">{language === 'tr' ? '₺0' : '$0'}</span>
                  <span className="text-muted-foreground">
                    {language === 'tr' ? '/ay' : '/month'}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {language === 'tr' ? 'Hızlı okumaya başlamak için' : 'Perfect for getting started'}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{language === 'tr' ? 'Ayda 2 PDF yükleme' : '2 PDFs per month'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{language === 'tr' ? 'RSVP okuma modu' : 'RSVP reading mode'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{language === 'tr' ? 'Biyonik okuma modu' : 'Bionic reading mode'}</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <Check className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{language === 'tr' ? 'AI özet ve podcast' : 'AI summary & podcast'}</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/signup">
                  {language === 'tr' ? 'Ücretsiz Başla' : 'Get Started Free'}
                </Link>
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                {language === 'tr' ? 'Popüler' : 'Popular'}
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 font-fragor">Premium</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">
                    {premiumPrice.symbol}{premiumPrice.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">
                    {language === 'tr' ? '/ay' : '/month'}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {language === 'tr' ? 'Sınırsız okuma ve AI özellikleri' : 'Unlimited reading with AI features'}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-semibold">
                    {language === 'tr' ? 'Sınırsız PDF yükleme' : 'Unlimited PDF uploads'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{language === 'tr' ? 'RSVP okuma modu' : 'RSVP reading mode'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{language === 'tr' ? 'Biyonik okuma modu' : 'Bionic reading mode'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-semibold">
                    {language === 'tr' ? 'AI özet oluşturma' : 'AI summary generation'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-semibold">
                    {language === 'tr' ? 'AI podcast oluşturma' : 'AI podcast creation'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{language === 'tr' ? 'Öncelikli destek' : 'Priority support'}</span>
                </li>
              </ul>

              {isPremium && !isExpired ? (
                <Button className="w-full" disabled>
                  <Crown className="w-4 h-4 mr-2" />
                  {language === 'tr' ? 'Aktif Premium' : 'Active Premium'}
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <Link href="/checkout/premium">
                    {language === 'tr' ? 'Premium\'a Geç' : 'Upgrade to Premium'}
                  </Link>
                </Button>
              )}
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Sıkça Sorulan Sorular</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Ücretsiz plandan Premium'a nasıl geçebilirim?</h3>
                <p className="text-muted-foreground">
                  Hesap ayarlarınızdan istediğiniz zaman Premium'a geçiş yapabilirsiniz. Mevcut PDF'leriniz korunur.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Premium aboneliğimi iptal edebilir miyim?</h3>
                <p className="text-muted-foreground">
                  Evet, istediğiniz zaman iptal edebilirsiniz. İptal sonrası dönem sonuna kadar Premium özelliklerini
                  kullanmaya devam edebilirsiniz.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">AI özellikleri nasıl çalışır?</h3>
                <p className="text-muted-foreground">
                  Gemini AI kullanarak PDF içeriğinizden otomatik özet ve podcast senaryosu oluşturuyoruz. Bu özellik
                  sadece Premium kullanıcılar için mevcuttur.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
