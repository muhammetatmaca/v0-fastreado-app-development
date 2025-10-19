import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Zap } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Fastreado</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Basit ve şeffaf fiyatlandırma</h1>
            <p className="text-lg text-muted-foreground">İhtiyacınıza uygun planı seçin</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 border-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Ücretsiz</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">₺0</span>
                  <span className="text-muted-foreground">/ay</span>
                </div>
                <p className="text-muted-foreground">Hızlı okumaya başlamak için</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Ayda 2 PDF yükleme</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>RSVP okuma modu</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Biyonik okuma modu</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <Check className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span>AI özet ve podcast</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/signup">Ücretsiz Başla</Link>
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Popüler
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">₺49</span>
                  <span className="text-muted-foreground">/ay</span>
                </div>
                <p className="text-muted-foreground">Sınırsız okuma ve AI özellikleri</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-semibold">Sınırsız PDF yükleme</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>RSVP okuma modu</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Biyonik okuma modu</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-semibold">AI özet oluşturma</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-semibold">AI podcast oluşturma</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Öncelikli destek</span>
                </li>
              </ul>

              <Button className="w-full" asChild>
                <Link href="/checkout/premium">Premium'a Geç</Link>
              </Button>
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
