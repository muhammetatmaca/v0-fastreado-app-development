"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"

export default function PrivacyPage() {
  const { t, language } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'tr' ? 'Ana Sayfa' : 'Home'}
              </Link>
            </Button>
            <img src="/fastreado-logo.png" alt="Fastreado" className="h-8 w-auto logo-img" />
          </div>
          <LanguageFlags />
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 font-fragor">
          {language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-muted-foreground">
            {language === 'tr' 
              ? 'Son güncelleme: 23 Ekim 2025'
              : 'Last updated: October 23, 2025'
            }
          </p>

          {language === 'tr' ? (
            <>
              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">1. Toplanan Bilgiler</h2>
                <p className="text-muted-foreground mb-4">
                  Fastreado olarak, hizmetlerimizi sunabilmek için aşağıdaki bilgileri topluyoruz:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Hesap bilgileri (e-posta, ad, şifre)</li>
                  <li>Yüklediğiniz PDF dosyaları</li>
                  <li>Okuma istatistikleri ve tercihleri</li>
                  <li>Cihaz ve tarayıcı bilgileri</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">2. Bilgilerin Kullanımı</h2>
                <p className="text-muted-foreground mb-4">
                  Topladığımız bilgileri şu amaçlarla kullanırız:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Hizmetlerimizi sunmak ve geliştirmek</li>
                  <li>Kullanıcı deneyimini kişiselleştirmek</li>
                  <li>Teknik destek sağlamak</li>
                  <li>Güvenlik ve dolandırıcılık önleme</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">3. Bilgi Paylaşımı</h2>
                <p className="text-muted-foreground">
                  Kişisel bilgilerinizi üçüncü taraflarla paylaşmayız. Sadece yasal zorunluluklar 
                  veya güvenlik tehditleri durumunda gerekli bilgileri yetkili makamlarla paylaşabiliriz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">4. Veri Güvenliği</h2>
                <p className="text-muted-foreground">
                  Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. 
                  Tüm veriler şifrelenerek saklanır ve güvenli sunucularda barındırılır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">5. Çerezler</h2>
                <p className="text-muted-foreground">
                  Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanıyoruz. 
                  Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">6. Kullanıcı Hakları</h2>
                <p className="text-muted-foreground mb-4">
                  KVKK kapsamında aşağıdaki haklarınız bulunmaktadır:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>Kişisel verilerinizin düzeltilmesini isteme</li>
                  <li>Kişisel verilerinizin silinmesini isteme</li>
                  <li>Hesabınızı kapatma</li>
                </ul>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  As Fastreado, we collect the following information to provide our services:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Account information (email, name, password)</li>
                  <li>PDF files you upload</li>
                  <li>Reading statistics and preferences</li>
                  <li>Device and browser information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">2. How We Use Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide and improve our services</li>
                  <li>Personalize user experience</li>
                  <li>Provide technical support</li>
                  <li>Security and fraud prevention</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">3. Information Sharing</h2>
                <p className="text-muted-foreground">
                  We do not share your personal information with third parties. We may only share 
                  necessary information with authorities in case of legal obligations or security threats.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We use industry-standard security measures to protect your data. All data is 
                  stored encrypted and hosted on secure servers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">5. Cookies</h2>
                <p className="text-muted-foreground">
                  We use cookies on our website to improve user experience. You can disable 
                  cookies from your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">6. User Rights</h2>
                <p className="text-muted-foreground mb-4">
                  Under GDPR, you have the following rights:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Know whether your personal data is being processed</li>
                  <li>Request correction of your personal data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Close your account</li>
                </ul>
              </section>
            </>
          )}

          <section className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 font-fragor">
              {language === 'tr' ? 'İletişim' : 'Contact'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'tr'
                ? 'Gizlilik politikamız hakkında sorularınız için: muhammetatmaca79@gmail.com'
                : 'For questions about our privacy policy: muhammetatmaca79@gmail.com'
              }
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}