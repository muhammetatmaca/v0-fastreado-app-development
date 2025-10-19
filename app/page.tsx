import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Zap, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Fastreado</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Özellikler
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Fiyatlandırma
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              SSS
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Yapay zeka destekli hızlı okuma</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight">
            Okuma hızınızı <span className="text-primary">3 katına</span> çıkarın
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed max-w-2xl mx-auto">
            RSVP ve Biyonik Okuma teknolojileri ile PDF'lerinizi daha hızlı okuyun. Yapay zeka ile özet ve podcast
            oluşturun.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup">Ücretsiz Başla</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
              <Link href="#demo">Demo İzle</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Kredi kartı gerektirmez • Ayda 2 PDF ücretsiz</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Güçlü özellikler</h2>
            <p className="text-lg text-muted-foreground">Okuma deneyiminizi geliştiren modern araçlar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">RSVP Okuma</h3>
              <p className="text-muted-foreground leading-relaxed">
                Kelime kelime hızlı okuma modu. Orta harfi vurgulama ile odaklanmanızı artırın.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Biyonik Okuma</h3>
              <p className="text-muted-foreground leading-relaxed">
                İlk ve son harfleri kalın göstererek doğal okuma hızınızı artırın.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Özet & Podcast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Gemini AI ile otomatik özet oluşturun ve podcast'e dönüştürün.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-4xl mx-auto text-center bg-card border border-border rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hızlı okumaya bugün başlayın</h2>
          <p className="text-lg text-muted-foreground mb-8">Ücretsiz hesap oluşturun ve ayda 2 PDF ile başlayın</p>
          <Button size="lg" asChild>
            <Link href="/signup">Ücretsiz Başla</Link>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-lg text-muted-foreground">Merak ettikleriniz</p>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">RSVP okuma nedir?</h3>
              <p className="text-muted-foreground leading-relaxed">
                RSVP (Rapid Serial Visual Presentation), kelimeleri tek tek ekranın ortasında göstererek okuma hızınızı
                artıran bir tekniktir. Orta harfi vurgulayarak gözünüzün odaklanmasını kolaylaştırır.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Biyonik okuma nasıl çalışır?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Biyonik okuma, kelimelerin ilk ve son harflerini kalın göstererek beynin kelimeleri daha hızlı
                tanımasını sağlar. Bu sayede doğal okuma hızınız artar.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">AI özellikleri neler sunar?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Premium üyelikle PDF'lerinizden otomatik özet oluşturabilir ve podcast senaryosu üretebilirsiniz. Gemini
                AI teknolojisi kullanılarak içeriğiniz analiz edilir.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Ücretsiz plan ile kaç PDF yükleyebilirim?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ücretsiz plan ile ayda 2 PDF yükleyebilirsiniz. Sınırsız PDF yüklemek için Premium plana geçebilirsiniz.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Hangi PDF formatları destekleniyor?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Standart PDF formatları desteklenmektedir. Metin içeren tüm PDF'leri yükleyebilir ve okuyabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-bold">Fastreado</span>
              </div>
              <p className="text-sm text-muted-foreground">Hızlı okuma için modern platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Özellikler
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Fiyatlandırma
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-foreground transition-colors">
                    SSS
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
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
              <h4 className="font-semibold mb-4">Yasal</h4>
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
