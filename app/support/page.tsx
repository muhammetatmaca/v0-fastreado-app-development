import Link from "next/link"
import { ArrowLeft, Mail, MessageCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SupportPage() {
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

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Ana Sayfaya Dön
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Destek Merkezi</h1>
          <p className="text-lg text-muted-foreground">Size nasıl yardımcı olabiliriz?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">E-posta Desteği</h3>
            <p className="text-muted-foreground mb-4">
              Sorularınız için bize e-posta gönderin. 24 saat içinde yanıt veriyoruz.
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:destek@fastreado.com">destek@fastreado.com</a>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Canlı Destek</h3>
            <p className="text-muted-foreground mb-4">Premium kullanıcılar için öncelikli canlı destek hizmeti.</p>
            <Button variant="outline" disabled>
              Yakında Gelecek
            </Button>
          </Card>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold">Sıkça Sorulan Sorular</h2>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">PDF yüklerken hata alıyorum, ne yapmalıyım?</h3>
            <p className="text-muted-foreground leading-relaxed">
              PDF dosyanızın 50MB'dan küçük olduğundan ve şifre korumalı olmadığından emin olun. Sorun devam ederse,
              dosyayı farklı bir PDF okuyucudan "Farklı Kaydet" ile yeniden kaydetmeyi deneyin.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">RSVP okuma hızını nasıl ayarlayabilirim?</h3>
            <p className="text-muted-foreground leading-relaxed">
              RSVP okuma modunda, ekranın alt kısmındaki hız kontrolünü kullanarak kelime/dakika (WPM) değerini
              ayarlayabilirsiniz. Başlangıç için 250-300 WPM önerilir.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">AI özellikleri nasıl çalışır?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Premium kullanıcılar, PDF içeriğinden otomatik özet ve podcast senaryosu oluşturabilir. Google Gemini AI
              kullanarak içeriğinizi analiz eder ve özetler. Bu işlem birkaç saniye sürer.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Aboneliğimi nasıl iptal edebilirim?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Hesap ayarlarınızdan "Abonelik Yönetimi" bölümüne giderek aboneliğinizi iptal edebilirsiniz. İptal sonrası
              mevcut dönem sonuna kadar Premium özelliklerini kullanmaya devam edebilirsiniz.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Verilerim güvende mi?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Evet, tüm verileriniz şifrelenmiş olarak saklanır. PDF dosyalarınız güvenli bulut depolama sistemlerinde
              tutulur ve sadece sizin erişiminize açıktır. Daha fazla bilgi için{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                gizlilik politikamızı
              </Link>{" "}
              inceleyebilirsiniz.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Mobil uygulama var mı?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Şu anda web uygulaması olarak hizmet veriyoruz. Mobil tarayıcınızdan Fastreado'ya erişebilir ve tüm
              özellikleri kullanabilirsiniz. iOS ve Android uygulamaları yakında gelecek.
            </p>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Card className="p-8 bg-muted/50">
            <h3 className="text-2xl font-bold mb-4">Sorunuz yanıtlanmadı mı?</h3>
            <p className="text-muted-foreground mb-6">
              Başka bir sorunuz varsa, bize e-posta gönderin. Size yardımcı olmaktan mutluluk duyarız.
            </p>
            <Button asChild>
              <a href="mailto:destek@fastreado.com">Bize Ulaşın</a>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
