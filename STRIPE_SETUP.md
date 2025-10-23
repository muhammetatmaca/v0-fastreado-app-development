# Stripe Entegrasyonu Kurulum Rehberi

## 1. Stripe Hesabı Oluşturma

1. [Stripe Dashboard](https://dashboard.stripe.com/) adresine git
2. Hesap oluştur veya giriş yap
3. Test modunda çalışmaya başla

## 2. API Anahtarlarını Alma

1. Dashboard'da **Developers > API keys** bölümüne git
2. **Test keys** sekmesinde:
   - **Publishable key** (pk_test_...) kopyala
   - **Secret key** (sk_test_...) kopyala

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