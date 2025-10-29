# Freemius Entegrasyonu Rehberi

## 1. Freemius Hesabı Oluşturma

1. [Freemius Dashboard](https://dashboard.freemius.com/) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. "Add New Product" butonuna tıklayın
4. Ürün tipini "SaaS" olarak seçin

## 2. Ürün Konfigürasyonu

### Temel Bilgiler
- **Product Name**: FastReado
- **Product Type**: SaaS
- **Category**: Productivity
- **Description**: Fast reading and PDF processing tool

### Pricing Plans
Aşağıdaki planları oluşturun:

#### Free Plan
- **Plan Name**: Free
- **Price**: $0
- **Billing Cycle**: Monthly
- **Features**: 2 PDFs per month, Basic reading modes

#### Premium Plan
- **Plan Name**: Premium
- **Price**: $2.99 USD / ₺99 TRY
- **Billing Cycle**: Monthly
- **Features**: Unlimited PDFs, AI features, Priority support

## 3. API Keys Alma

Dashboard'dan aşağıdaki bilgileri alın:

1. **Plugin/Product ID**: Dashboard > Your Product > Settings > General
2. **Public Key**: Dashboard > Your Product > Settings > Keys > Public Key
3. **Secret Key**: Dashboard > Your Product > Settings > Keys > Secret Key
4. **Webhook Secret**: Dashboard > Your Product > Settings > Webhooks > Secret

## 4. Environment Variables

`.env` dosyanıza aşağıdaki değişkenleri ekleyin:

```env
# Freemius configuration
FREEMIUS_ID=your_product_id_here
FREEMIUS_PUBLIC_KEY=pk_your_public_key_here
FREEMIUS_SECRET_KEY=sk_your_secret_key_here
FREEMIUS_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 5. Webhook URL Konfigürasyonu

Freemius Dashboard'da webhook URL'ini ayarlayın:
- **Webhook URL**: `https://yourdomain.com/api/webhooks/freemius`
- **Events**: subscription.created, subscription.updated, subscription.cancelled, subscription.expired

## 6. Test Etme

1. Checkout sayfasında Freemius seçeneğini seçin
2. Test ödeme yapın (Freemius sandbox modunda)
3. Webhook'ların çalıştığını kontrol edin
4. Kullanıcının premium'a yükseltildiğini doğrulayın

## 7. Production'a Geçiş

1. Freemius Dashboard'da "Live Mode" aktif edin
2. Production API keys'lerini `.env` dosyasına ekleyin
3. Webhook URL'ini production domain'e güncelleyin
4. Test ödemesi yaparak doğrulayın

## Önemli Notlar

- Freemius, WordPress ve SaaS ürünleri için optimize edilmiştir
- Otomatik vergi hesaplama ve fatura oluşturma sunar
- Çoklu para birimi desteği vardır
- Abonelik yönetimi otomatiktir
- Müşteri portalı built-in gelir

## Sorun Giderme

### Yaygın Hatalar

1. **Invalid API Keys**: Keys'lerin doğru kopyalandığından emin olun
2. **Webhook Verification Failed**: Webhook secret'ın doğru olduğunu kontrol edin
3. **Plan Not Found**: Plan ID'lerinin Freemius dashboard'daki ile eşleştiğinden emin olun

### Debug İpuçları

- Freemius Dashboard > Logs bölümünden webhook loglarını kontrol edin
- Browser console'da JavaScript hatalarını kontrol edin
- Server loglarında webhook processing hatalarını kontrol edin