"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Sparkles, Zap } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"
import { DemoVideo } from "@/components/demo-video"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { t, isLoading, language } = useTranslation()
  const { user, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img src="/fastreado-logo.png" alt="Fastreado" className="h-12 w-auto mx-auto mb-4 animate-pulse logo-img" />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/fastreado-logo.png" alt="Fastreado" className="h-10 w-auto logo-img" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.features")}
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.pricing")}
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.faq")}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageFlags />
            {user ? (
              // Giriş yapmış kullanıcı
              <>
                <Button variant="ghost" asChild>
                  <Link href="/library">{t("nav.library")}</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/my-pdfs">PDF'lerim</Link>
                </Button>
                <Button variant="ghost" onClick={logout}>
                  {t("auth.logout")}
                </Button>
              </>
            ) : (
              // Giriş yapmamış kullanıcı
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">{t("auth.login")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">{t("common.start")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            <span>{t("home.hero_badge")}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight font-fragor">
            {t("home.hero_title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed max-w-2xl mx-auto">
            {t("home.hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup">{t("home.get_started")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
              <Link href="#demo">{t("home.watch_demo")}</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">{t("home.no_credit_card")}</p>

          {/* Demo Video Component */}
          <DemoVideo />


        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-fragor">{t("home.features_title")}</h2>
            <p className="text-lg text-muted-foreground">{t("home.features_subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-fragor">{t("home.rsvp_title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("home.rsvp_desc")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-fragor">{t("home.bionic_title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("home.bionic_desc")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-fragor">{t("home.ai_title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("home.ai_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-4xl mx-auto text-center bg-card border border-border rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-fragor">{t("home.cta_title")}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t("home.cta_subtitle")}</p>
          <Button size="lg" asChild>
            <Link href="/signup">{t("home.get_started")}</Link>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-fragor">{t("home.faq_title")}</h2>
            <p className="text-lg text-muted-foreground">{t("home.faq_subtitle")}</p>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 font-fragor">
                {language === 'tr' ? 'Fastreado nasıl çalışır?' : 'How does Fastreado work?'}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'tr'
                  ? 'PDF dosyalarınızı yükleyin ve RSVP veya Biyonik Okuma teknolojileri ile hızlı okuma deneyimi yaşayın. AI ile otomatik özet ve podcast oluşturabilirsiniz.'
                  : 'Upload your PDF files and experience speed reading with RSVP or Bionic Reading technologies. Create automatic summaries and podcasts with AI.'
                }
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 font-fragor">
                {language === 'tr' ? 'Ücretsiz planda neler var?' : 'What\'s included in the free plan?'}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'tr'
                  ? 'Ücretsiz planda ayda 2 PDF yükleme hakkınız var. RSVP ve Biyonik Okuma özelliklerini kullanabilirsiniz.'
                  : 'The free plan includes 2 PDF uploads per month. You can use RSVP and Bionic Reading features.'
                }
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 font-fragor">
                {language === 'tr' ? 'Hangi dosya formatları destekleniyor?' : 'What file formats are supported?'}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'tr'
                  ? 'Şu anda sadece PDF dosyaları desteklenmektedir. Gelecekte daha fazla format eklenecektir.'
                  : 'Currently, only PDF files are supported. More formats will be added in the future.'
                }
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 font-fragor">
                {language === 'tr' ? 'AI özellikleri nasıl çalışır?' : 'How do AI features work?'}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'tr'
                  ? 'Gemini AI kullanarak PDF içeriğinizden otomatik özet oluşturur ve bu özeti podcast formatına dönüştürür.'
                  : 'Using Gemini AI, it creates automatic summaries from your PDF content and converts them into podcast format.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="hidden md:block border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/fastreado-logo.png" alt="Fastreado" className="h-8 w-auto logo-img" />
              </div>
              <p className="text-sm text-muted-foreground">Hızlı okuma için modern platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-fragor">Ürün</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    {t("nav.features")}
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    {t("nav.pricing")}
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-foreground transition-colors">
                    {t("nav.faq")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-fragor">Şirket</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-foreground transition-colors">
                    Destek
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-fragor">Yasal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-foreground transition-colors">
                    İade Politikası
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Fastreado. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}