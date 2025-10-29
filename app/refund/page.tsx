"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"

export default function RefundPage() {
  const { language } = useTranslation()

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
          {language === 'tr' ? 'İade Politikası' : 'Refund Policy'}
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-muted-foreground">
            {language === 'tr' 
              ? 'Son güncelleme: 27 Ekim 2025'
              : 'Last updated: October 27, 2025'
            }
          </p>

          {language === 'tr' ? (
            <>
              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">1. İade Politikası Genel Kuralları</h2>
                <p className="text-muted-foreground mb-4">
                  FastReado Premium aboneliği için aşağıdaki iade koşulları geçerlidir:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>İlk 7 gün içinde koşulsuz iade hakkı</li>
                  <li>Teknik sorunlar nedeniyle hizmet alamama durumunda tam iade</li>
                  <li>Kullanılmayan dönemler için orantılı iade</li>
                  <li>İade talepleri 30 gün içinde değerlendirilir</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">2. İade Koşulları</h2>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">✅ İade Alabileceğiniz Durumlar</h3>
                    <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                      <li>İlk 7 gün içinde memnun kalmama</li>
                      <li>Teknik sorunlar nedeniyle hizmet alamama</li>
                      <li>Yanlışlıkla yapılan çoklu ödemeler</li>
                      <li>Hizmet kesintileri (24 saatten fazla)</li>
                      <li>Belirtilen özellikler çalışmıyor</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">❌ İade Alamayacağınız Durumlar</h3>
                    <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                      <li>7 günlük deneme süresinden sonra memnun kalmama</li>
                      <li>Hizmeti aktif olarak kullandıktan sonra iptal</li>
                      <li>Kullanım şartlarını ihlal eden hesaplar</li>
                      <li>Üçüncü taraf ödeme sağlayıcı sorunları</li>
                      <li>Kişisel tercih değişiklikleri</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">3. İade Süreci</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
                    <div>
                      <h3 className="font-semibold mb-1">İade Talebi</h3>
                      <p className="text-muted-foreground text-sm">
                        muhammetatmaca79@gmail.com adresine e-posta gönderin veya destek sayfasından iletişime geçin.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
                    <div>
                      <h3 className="font-semibold mb-1">Değerlendirme</h3>
                      <p className="text-muted-foreground text-sm">
                        Talebiniz 2-3 iş günü içinde incelenir ve size geri dönüş yapılır.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
                    <div>
                      <h3 className="font-semibold mb-1">İade İşlemi</h3>
                      <p className="text-muted-foreground text-sm">
                        Onaylanan iadeler 5-10 iş günü içinde ödeme yönteminize geri yansır.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">4. Ödeme Yöntemlerine Göre İade Süreleri</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">Ödeme Yöntemi</th>
                        <th className="border border-border p-3 text-left">İade Süresi</th>
                        <th className="border border-border p-3 text-left">Notlar</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3">Kredi Kartı</td>
                        <td className="border border-border p-3">3-5 iş günü</td>
                        <td className="border border-border p-3">Banka işlem süresine bağlı</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">PayPal</td>
                        <td className="border border-border p-3">1-3 iş günü</td>
                        <td className="border border-border p-3">En hızlı iade yöntemi</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">Banka Transferi</td>
                        <td className="border border-border p-3">5-10 iş günü</td>
                        <td className="border border-border p-3">Uluslararası transferler daha uzun</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">Kripto Para</td>
                        <td className="border border-border p-3">1-2 iş günü</td>
                        <td className="border border-border p-3">Blockchain onayına bağlı</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">5. Kısmi İadeler</h2>
                <p className="text-muted-foreground mb-4">
                  Aşağıdaki durumlarda kısmi iade yapılabilir:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Aylık aboneliğin bir kısmını kullandıktan sonra iptal</li>
                  <li>Hizmet kesintileri nedeniyle kullanılamayan günler</li>
                  <li>Premium özelliklerden sadece bir kısmına erişim sağlanması</li>
                  <li>Teknik sorunlar nedeniyle sınırlı hizmet alınması</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">6. İade Talep Bilgileri</h2>
                <p className="text-muted-foreground mb-4">
                  İade talebinizde aşağıdaki bilgileri belirtiniz:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Hesap e-posta adresiniz</li>
                  <li>Ödeme tarihi ve tutarı</li>
                  <li>İade sebebi (detaylı açıklama)</li>
                  <li>Ödeme makbuzu veya işlem numarası</li>
                  <li>Tercih ettiğiniz iade yöntemi</li>
                </ul>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">1. General Refund Policy</h2>
                <p className="text-muted-foreground mb-4">
                  The following refund conditions apply for FastReado Premium subscription:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Unconditional refund right within the first 7 days</li>
                  <li>Full refund for inability to receive service due to technical issues</li>
                  <li>Proportional refund for unused periods</li>
                  <li>Refund requests are evaluated within 30 days</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">2. Refund Conditions</h2>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">✅ Eligible for Refund</h3>
                    <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                      <li>Dissatisfaction within the first 7 days</li>
                      <li>Unable to receive service due to technical issues</li>
                      <li>Accidental multiple payments</li>
                      <li>Service interruptions (more than 24 hours)</li>
                      <li>Advertised features not working</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">❌ Not Eligible for Refund</h3>
                    <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
                      <li>Dissatisfaction after 7-day trial period</li>
                      <li>Cancellation after actively using the service</li>
                      <li>Accounts violating terms of service</li>
                      <li>Third-party payment provider issues</li>
                      <li>Personal preference changes</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">3. Refund Process</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
                    <div>
                      <h3 className="font-semibold mb-1">Refund Request</h3>
                      <p className="text-muted-foreground text-sm">
                        Send an email to muhammetatmaca79@gmail.com or contact us through the support page.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
                    <div>
                      <h3 className="font-semibold mb-1">Evaluation</h3>
                      <p className="text-muted-foreground text-sm">
                        Your request will be reviewed within 2-3 business days and you will receive a response.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
                    <div>
                      <h3 className="font-semibold mb-1">Refund Processing</h3>
                      <p className="text-muted-foreground text-sm">
                        Approved refunds will be reflected to your payment method within 5-10 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">4. Refund Times by Payment Method</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">Payment Method</th>
                        <th className="border border-border p-3 text-left">Refund Time</th>
                        <th className="border border-border p-3 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3">Credit Card</td>
                        <td className="border border-border p-3">3-5 business days</td>
                        <td className="border border-border p-3">Depends on bank processing time</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">PayPal</td>
                        <td className="border border-border p-3">1-3 business days</td>
                        <td className="border border-border p-3">Fastest refund method</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">Bank Transfer</td>
                        <td className="border border-border p-3">5-10 business days</td>
                        <td className="border border-border p-3">International transfers take longer</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">5. Partial Refunds</h2>
                <p className="text-muted-foreground mb-4">
                  Partial refunds may be issued in the following cases:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Cancellation after using part of monthly subscription</li>
                  <li>Days unavailable due to service interruptions</li>
                  <li>Access to only some of the premium features</li>
                  <li>Limited service due to technical issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-fragor">6. Refund Request Information</h2>
                <p className="text-muted-foreground mb-4">
                  Please include the following information in your refund request:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Your account email address</li>
                  <li>Payment date and amount</li>
                  <li>Reason for refund (detailed explanation)</li>
                  <li>Payment receipt or transaction number</li>
                  <li>Preferred refund method</li>
                </ul>
              </section>
            </>
          )}

          <section className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 font-fragor">
              {language === 'tr' ? 'İletişim' : 'Contact'}
            </h3>
            <p className="text-muted-foreground mb-2">
              {language === 'tr'
                ? 'İade talepleri ve sorularınız için:'
                : 'For refund requests and questions:'
              }
            </p>
            <p className="text-muted-foreground">
              📧 muhammetatmaca79@gmail.com
            </p>
            <p className="text-muted-foreground">
              🌐 <Link href="/support" className="text-primary hover:underline">
                {language === 'tr' ? 'Destek Sayfası' : 'Support Page'}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}