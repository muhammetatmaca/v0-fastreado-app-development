# Ödeme Sistemleri Kurulum Rehberi

## 🍋 Lemon Squeezy + 🏓 Paddle + ₿ Crypto Ödeme Entegrasyonu

## 1. Lemon Squeezy Kurulumu

### Hesap Oluşturma
1. [Lemon Squeezy](https://app.lemonsqueezy.com/) adresine git
2. Hesap oluştur (bireysel hesap yeterli)
3. Store oluştur

### API Anahtarları
1. **Settings > API** bölümüne git
2. **API Key** oluştur ve kopyala
3. **Store ID**'ni not al

### Ürün Oluşturma
1. **Products** bölümünde yeni ürün oluştur
2. **Premium Plan** için:
   - Name: "Fastreado Premium"
   - Price: $2.99/month (recurring)
3. **Variant ID**'yi not al

## 2. Coinbase Commerce Kurulumu

### Hesap Oluşturma
1. [Coinbase Commerce](https://commerce.coinbase.com/) adresine git
2. Hesap oluştur (bireysel hesap yeterli)
3. Business bilgilerini doldur

### API Anahtarları
1. **Settings > API keys** bölümüne git
2. **Create an API key** ile yeni anahtar oluştur
3. API key'i güvenli yerde sakla

## 3. Paddle Kurulumu

### Hesap Oluşturma
1. [Paddle](https://vendors.paddle.com/) adresine git
2. Vendor hesabı oluştur (bireysel hesap yeterli)
3. Hesap doğrulama işlemlerini tamamla

### API Anahtarları
1. **Developer Tools > Authentication** bölümüne git
2. **Vendor ID** ve **API Key**'i not al
3. **Public Key**'i webhook doğrulama için indir

### Ürün Oluşturma
1. **Catalog > Products** bölümünde yeni ürün oluştur
2. **Premium Plan** için:
   - Name: "Fastreado Premium"
   - Type: "Subscription"
   - Price: $2.99/month, ₺99/month
3. **Product ID**'yi not al

## 3. Environment Variables Güncelleme

`.env` dosyasında şu değerleri güncelle:

```env
# Stripe configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 4. Webhook Endpoint Kurulumu

1. Dashboard'da **Developers > Webhooks** bölümüne git
2. **Add endpoint** butonuna tıkla
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. **Select events** kısmında şu eventleri seç:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Add endpoint** ile kaydet
6. Oluşturulan webhook'un **Signing secret**'ini kopyala
7. `.env` dosyasında `STRIPE_WEBHOOK_SECRET` değerini güncelle

## 5. Test Kartları

Stripe test modunda şu kartları kullanabilirsin:

- **Başarılı ödeme:** 4242 4242 4242 4242
- **Başarısız ödeme:** 4000 0000 0000 0002
- **3D Secure:** 4000 0000 0000 3220

**Diğer bilgiler:**
- **Expiry:** Gelecekteki herhangi bir tarih (örn: 12/25)
- **CVC:** Herhangi bir 3 haneli sayı (örn: 123)
- **ZIP:** Herhangi bir posta kodu (örn: 12345)

## 6. Canlı Moda Geçiş

Test tamamlandıktan sonra:

1. Dashboard'da **Activate account** butonuna tıkla
2. Gerekli bilgileri doldur (şirket bilgileri, banka hesabı vb.)
3. **Live keys** sekmesinden canlı anahtarları al
4. `.env` dosyasını canlı anahtarlarla güncelle
5. Webhook endpoint'ini canlı moda geçir

## 7. Güvenlik Notları

- **Secret key**'i asla frontend'de kullanma
- Production'da environment variables'ları güvenli şekilde sakla
- Webhook endpoint'ini HTTPS ile koru
- Webhook signature'ını her zaman doğrula

## 8. Test Etme

1. `npm run dev` ile uygulamayı başlat
2. `/pricing` sayfasına git
3. Premium planını seç
4. Test kartı ile ödeme yap
5. Webhook'ların çalıştığını kontrol et

## Sorun Giderme

- **Invalid API Key:** API anahtarlarını kontrol et
- **Webhook failed:** Endpoint URL'ini ve secret'i kontrol et
- **Payment failed:** Test kartı bilgilerini kontrol et

## Destek

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)