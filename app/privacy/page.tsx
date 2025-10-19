import Link from "next/link"
import { ArrowLeft, Zap } from "lucide-react"

export default function PrivacyPage() {
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

        <h1 className="text-4xl font-bold mb-8">Gizlilik Politikası</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Toplanan Bilgiler</h2>
            <p className="text-muted-foreground leading-relaxed">
              Fastreado olarak, size daha iyi hizmet verebilmek için bazı kişisel bilgilerinizi topluyoruz. Bu bilgiler
              arasında e-posta adresiniz, yüklediğiniz PDF dosyaları ve okuma tercihleri yer almaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Bilgilerin Kullanımı</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Topladığımız bilgileri şu amaçlarla kullanıyoruz:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Hesabınızı oluşturmak ve yönetmek</li>
              <li>PDF dosyalarınızı saklamak ve işlemek</li>
              <li>AI destekli özet ve podcast özellikleri sunmak</li>
              <li>Ödeme işlemlerini gerçekleştirmek</li>
              <li>Müşteri desteği sağlamak</li>
              <li>Hizmetlerimizi geliştirmek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Veri Güvenliği</h2>
            <p className="text-muted-foreground leading-relaxed">
              Verilerinizin güvenliği bizim için önceliklidir. Tüm verileriniz şifrelenmiş olarak saklanır ve endüstri
              standardı güvenlik protokolleri ile korunur. PDF dosyalarınız güvenli bulut depolama sistemlerinde
              saklanır ve sadece sizin erişiminize açıktır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Üçüncü Taraf Hizmetler</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Hizmetlerimizi sunabilmek için aşağıdaki üçüncü taraf hizmetleri kullanıyoruz:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Stripe:</strong> Ödeme işlemleri için
              </li>
              <li>
                <strong>Vercel Blob:</strong> PDF dosya depolama için
              </li>
              <li>
                <strong>Google Gemini AI:</strong> AI özet ve podcast özellikleri için
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Çerezler</h2>
            <p className="text-muted-foreground leading-relaxed">
              Web sitemiz, kullanıcı deneyimini iyileştirmek ve hizmetlerimizi optimize etmek için çerezler kullanır.
              Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Haklarınız</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>Verilerin düzeltilmesini isteme</li>
              <li>Verilerin silinmesini veya yok edilmesini isteme</li>
              <li>Hesabınızı ve tüm verilerinizi silme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. İletişim</h2>
            <p className="text-muted-foreground leading-relaxed">
              Gizlilik politikamız hakkında sorularınız için{" "}
              <Link href="/support" className="text-primary hover:underline">
                destek sayfamızdan
              </Link>{" "}
              bizimle iletişime geçebilirsiniz.
            </p>
          </section>

          <section>
            <p className="text-sm text-muted-foreground">
              Son güncelleme:{" "}
              {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
