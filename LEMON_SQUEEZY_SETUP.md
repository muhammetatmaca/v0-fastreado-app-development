# Lemon Squeezy Kurulum Rehberi

## 1. Hesap Oluşturma
1. https://lemonsqueezy.com adresine git
2. "Sign up" ile hesap oluştur
3. Email doğrulaması yap

## 2. Store Kurulumu
1. Dashboard'da "Create Store" tıkla
2. Store adı: "Fastreado"
3. Currency: "TRY" (Türk Lirası) seç
4. Store URL: "fastreado" (benzersiz olmalı)

## 3. Ürün Oluşturma

### Premium Monthly Plan
1. Products > "Create Product" tıkla
2. Product Type: "Subscription" seç
3. Bilgiler:
   - Name: "Fastreado Premium - Monthly"
   - Description: "Sınırsız PDF yükleme ve premium özellikler"
   - Price: ₺99.99
   - Billing Cycle: "Monthly"
   - Trial Period: 7 days (isteğe bağlı)

### Premium Yearly Plan  
1. Yeni ürün oluştur
2. Bilgiler:
   - Name: "Fastreado Premium - Yearly"
   - Description: "Sınırsız PDF yükleme ve premium özellikler (2 ay ücretsiz)"
   - Price: ₺999.99
   - Billing Cycle: "Yearly"

## 4. API Keys
1. Settings > API tıkla
2. "Create API Key" tıkla
3. Name: "Fastreado Production"
4. Permissions: "Read" ve "Write" seç
5. API Key'i kopyala ve .env dosyasına ekle

## 5. Webhook Kurulumu
1. Settings > Webhooks tıkla
2. "Create Webhook" tıkla
3. URL: "https://yourdomain.com/api/webhooks/lemonsqueezy"
4. Events seç:
   - subscription_created
   - subscription_updated
   - subscription_cancelled
   - subscription_resumed
   - subscription_expired
   - order_created

## 6. Environment Variables
.env dosyasına ekle:

```
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
```

## 7. Test Modu
- Başlangıçta "Test Mode" kullan
- Gerçek ödemeler için "Live Mode"a geç
- Test kartları: https://docs.lemonsqueezy.com/help/checkout/test-mode

## 8. Store ID ve Variant ID'leri Bulma

### Store ID:
1. Dashboard > Settings > General
2. "Store ID" kopyala (örnek: 12345)

### Variant ID'leri:
1. Products sayfasında ürününe tıkla
2. URL'de variant ID'yi göreceksin: `/variants/123456`
3. Veya API ile çek:

```bash
curl "https://api.lemonsqueezy.com/v1/variants" \
  -H "Accept: application/vnd.api+json" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 9. .env Dosyasını Güncelle

```env
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 10. Kod Güncellemesi

`app/actions/lemonsqueezy.ts` dosyasında VARIANT_IDS'i güncelle:

```typescript
const VARIANT_IDS = {
  premium: '123456', // Premium Monthly variant ID
  yearly: '123457'   // Premium Yearly variant ID
}
```