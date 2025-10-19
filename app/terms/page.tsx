import Link from "next/link"
import { ArrowLeft, Zap } from "lucide-react"

export default function TermsPage() {
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

        <h1 className="text-4xl font-bold mb-8">Kullanım Koşulları</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Hizmet Tanımı</h2>
            <p className="text-muted-foreground leading-relaxed">
              Fastreado, kullanıcıların PDF dosyalarını hızlı okuma teknikleri ile okumalarını sağlayan bir web
              uygulamasıdır. RSVP (Rapid Serial Visual Presentation) ve Biyonik Okuma modları ile okuma hızınızı
              artırabilir, AI destekli özelliklerle içerik özetleri ve podcast senaryoları oluşturabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Hesap Oluşturma</h2>
            <p className="text-muted-foreground leading-relaxed">
              Fastreado'yu kullanmak için bir hesap oluşturmanız gerekmektedir. Hesap oluştururken verdiğiniz bilgilerin
              doğru ve güncel olmasından siz sorumlusunuz. Hesap güvenliğinizi korumak için şifrenizi kimseyle
              paylaşmamalısınız.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Abonelik ve Ödeme</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Fastreado iki farklı plan sunar:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Ücretsiz Plan:</strong> Ayda 2 PDF yükleme hakkı, temel okuma özellikleri
              </li>
              <li>
                <strong>Premium Plan:</strong> Sınırsız PDF, AI özellikleri, aylık ₺49
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Premium abonelik otomatik olarak yenilenir. İstediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut
              dönem sonuna kadar Premium özelliklerini kullanmaya devam edebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. İçerik Kullanımı</h2>
            <p className="text-muted-foreground leading-relaxed">
              Yüklediğiniz PDF dosyaları size aittir ve sadece sizin erişiminize açıktır. Telif hakkı korumalı
              içerikleri yüklerken gerekli izinlere sahip olduğunuzdan emin olmalısınız. Yasadışı, zararlı veya uygunsuz
              içerik yüklemek yasaktır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. AI Özellikleri</h2>
            <p className="text-muted-foreground leading-relaxed">
              AI destekli özet ve podcast özellikleri, Google Gemini AI kullanılarak oluşturulur. Bu özellikler Premium
              plan kullanıcılarına sunulur. AI tarafından oluşturulan içerikler referans amaçlıdır ve doğruluğu garanti
              edilmez.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Hizmet Değişiklikleri</h2>
            <p className="text-muted-foreground leading-relaxed">
              Fastreado, hizmetlerini, özelliklerini ve fiyatlandırmasını önceden haber vermeksizin değiştirme hakkını
              saklı tutar. Önemli değişiklikler e-posta yoluyla bildirilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Hesap İptali</h2>
            <p className="text-muted-foreground leading-relaxed">
              Hesabınızı istediğiniz zaman silebilirsiniz. Hesap silme işlemi geri alınamaz ve tüm verileriniz kalıcı
              olarak silinir. Kullanım koşullarını ihlal etmeniz durumunda hesabınız askıya alınabilir veya silinebilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Sorumluluk Reddi</h2>
            <p className="text-muted-foreground leading-relaxed">
              Fastreado hizmeti "olduğu gibi" sunulur. Hizmetin kesintisiz veya hatasız olacağını garanti etmiyoruz.
              Hizmet kullanımından kaynaklanan herhangi bir kayıptan sorumlu değiliz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. İletişim</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kullanım koşulları hakkında sorularınız için{" "}
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
