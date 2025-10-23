"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"

export default function TermsPage() {
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
          {language === 'tr' ? 'Kullanım Şartları' : 'Terms of Service'}
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
                <h2 className="text-2xl font-semibold mb-4 font-fragor">1. Hizmet Şartları</h2>
                <p className="text-muted-foreground">
                  Fastreado hizmetlerini kullanarak bu şartları kabul etmiş sayılırsınız. 
                  Bu şartları kabul etmiyorsanız hizmetlerimizi kullanmamalısınız.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">2. Hesap Sorumluluğu</h2>
                <p className="text-muted-foreground mb-4">
                  Hesabınızın güvenliğinden siz sorumlusunuz:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Güçlü bir şifre kullanın</li>
                  <li>Hesap bilgilerinizi kimseyle paylaşmayın</li>
                  <li>Şüpheli aktiviteleri derhal bildirin</li>
                  <li>Hesabınızda yapılan tüm işlemlerden sorumlusunuz</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">3. İçerik Politikası</h2>
                <p className="text-muted-foreground mb-4">
                  Yüklediğiniz içerikler için aşağıdaki kurallar geçerlidir:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Telif hakkı ihlali yapan içerik yükleyemezsiniz</li>
                  <li>Yasadışı, zararlı veya saldırgan içerik yasaktır</li>
                  <li>Kişisel veriler içeren dosyaları dikkatli kullanın</li>
                  <li>Spam veya reklam içeriği yükleyemezsiniz</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">4. Hizmet Kullanımı</h2>
                <p className="text-muted-foreground mb-4">
                  Hizmetlerimizi kullanırken:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Sistemi kötüye kullanamaz veya zarar veremezsiniz</li>
                  <li>Otomatik araçlar veya botlar kullanamazsınız</li>
                  <li>Diğer kullanıcıların deneyimini bozamazsınız</li>
                  <li>Hizmet limitlerini aşmaya çalışamazsınız</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">5. Ödeme ve İptal</h2>
                <p className="text-muted-foreground mb-4">
                  Premium abonelik için:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Ödemeler aylık olarak tahsil edilir</li>
                  <li>İstediğiniz zaman aboneliğinizi iptal edebilirsiniz</li>
                  <li>İptal sonrası mevcut dönem sonuna kadar hizmet devam eder</li>
                  <li>İade politikamız için iletişime geçin</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">6. Hizmet Değişiklikleri</h2>
                <p className="text-muted-foreground">
                  Fastreado, hizmetlerini geliştirmek için özellik ekleyebilir, değiştirebilir 
                  veya kaldırabilir. Önemli değişiklikler önceden bildirilecektir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">7. Sorumluluk Reddi</h2>
                <p className="text-muted-foreground">
                  Fastreado hizmetleri "olduğu gibi" sunulur. Hizmet kesintileri, veri kaybı 
                  veya diğer zararlardan sorumlu değiliz. Hizmetlerimizi kendi riskinizle kullanırsınız.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">8. Hesap Kapatma</h2>
                <p className="text-muted-foreground">
                  Bu şartları ihlal eden hesapları uyarı vermeden kapatma hakkımız saklıdır. 
                  Hesabınızı istediğiniz zaman kapatabilirsiniz.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">1. Service Terms</h2>
                <p className="text-muted-foreground">
                  By using Fastreado services, you agree to these terms. If you do not agree 
                  to these terms, you should not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">2. Account Responsibility</h2>
                <p className="text-muted-foreground mb-4">
                  You are responsible for the security of your account:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Use a strong password</li>
                  <li>Do not share your account information with anyone</li>
                  <li>Report suspicious activities immediately</li>
                  <li>You are responsible for all activities on your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">3. Content Policy</h2>
                <p className="text-muted-foreground mb-4">
                  The following rules apply to content you upload:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>You cannot upload content that violates copyright</li>
                  <li>Illegal, harmful or offensive content is prohibited</li>
                  <li>Use files containing personal data carefully</li>
                  <li>You cannot upload spam or advertising content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">4. Service Usage</h2>
                <p className="text-muted-foreground mb-4">
                  When using our services:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>You cannot abuse or damage the system</li>
                  <li>You cannot use automated tools or bots</li>
                  <li>You cannot disrupt other users' experience</li>
                  <li>You cannot attempt to exceed service limits</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">5. Payment and Cancellation</h2>
                <p className="text-muted-foreground mb-4">
                  For premium subscription:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Payments are charged monthly</li>
                  <li>You can cancel your subscription at any time</li>
                  <li>Service continues until the end of current period after cancellation</li>
                  <li>Contact us for refund policy</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">6. Service Changes</h2>
                <p className="text-muted-foreground">
                  Fastreado may add, modify or remove features to improve its services. 
                  Significant changes will be notified in advance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">7. Disclaimer</h2>
                <p className="text-muted-foreground">
                  Fastreado services are provided "as is". We are not responsible for service 
                  interruptions, data loss or other damages. You use our services at your own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">8. Account Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to close accounts that violate these terms without warning. 
                  You can close your account at any time.
                </p>
              </section>
            </>
          )}

          <section className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 font-fragor">
              {language === 'tr' ? 'İletişim' : 'Contact'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'tr'
                ? 'Kullanım şartları hakkında sorularınız için: muhammetatmaca79@gmail.com'
                : 'For questions about our terms of service: muhammetatmaca79@gmail.com'
              }
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}