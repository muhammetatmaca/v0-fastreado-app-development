# Lemon Squeezy Entegrasyonu Rehberi

## 1. Lemon Squeezy Hesabı Oluşturma

1. **https://lemonsqueezy.com** adresine gidin
2. Hesap oluşturun veya giriş yapın
3. **"Create Store"** butonuna tıklayın
4. Store bilgilerinizi doldurun

## 2. Ürün ve Variant Oluşturma

### Ürün Oluşturma
1. Dashboard'da **"Products"** bölümüne gidin
2. **"New Product"** butonuna tıklayın
3. Ürün bilgilerini doldurun:
   - **Name**: FastReado Premium
   - **Description**: Sınırsız PDF okuma ve AI özellikleri
   - **Price**: ₺99 (veya $2.99)
   - **Type**: Subscription

### Variant Oluşturma
1. Ürününüzü oluşturduktan sonra **"Variants"** sekmesine gidin
2. **"Add Variant"** butonuna tıklayın
3. Variant bilgilerini doldurun:
   - **Name**: Monthly Subscription
   - **Price**: ₺99/ay
   - **Billing Interval**: Monthly

## 3. API Keys Alma

1. Dashboard'da **"Settings"** > **"API"** bölümüne gidin
2. **"Create API Key"** butonuna tıklayın
3. Aşağıdaki bilgileri kopyalayın:
   - **API Key**: Uzun token (Bearer token olarak kullanılacak)
   - **Store ID**: Sayısal ID
   - **Webhook Secret**: Webhook doğrulama için

## 4. Environment Variables Güncelleme

`.env` dosyanızda şu değerleri güncelleyin:

```env
# Lemon Squeezy configuration
LEMONSQUEEZY_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9... # Gerçek API key'inizi buraya
LEMONSQUEEZY_STORE_ID=235497 # Gerçek Store ID'nizi buraya
LEMONSQUEEZY_WEBHOOK_SECRET=muhammet # Güçlü bir secret oluşturun
```

## 5. Variant ID Güncelleme

`app/actions/lemonsqueezy.ts` dosyasında variant ID'yi güncelleyin:

```typescript
const VARIANT_IDS = {
  premium: '1057551', // Gerçek variant ID'nizi buraya yazın
  yearly: '1057551'   // Yearly plan eklerseniz ayrı ID
}
```

## 6. Webhook Konfigürasyonu

### Lemon Squeezy Dashboard'da:
1. **Settings** > **Webhooks** bölümüne gidin
2. **"Add Webhook"** butonuna tıklayın
3. Webhook bilgilerini doldurun:
   - **URL**: `https://fastreado.com.tr/api/webhooks/lemonsqueezy`
   - **Events**: 
     - ✅ `subscription_created`
     - ✅ `subscription_updated`
     - ✅ `subscription_cancelled`
     - ✅ `subscription_expired`
     - ✅ `order_created`
   - **Secret**: `.env` dosyasındaki `LEMONSQUEEZY_WEBHOOK_SECRET` değeri

## 7. Test Etme

### Webhook Test
```bash
curl https://fastreado.com.tr/api/webhooks/lemonsqueezy
```

Bu size webhook'un aktif olduğunu gösteren bir JSON response döndürmelidir.

### Checkout Test
1. Sitenizde Premium'a geçiş yapın
2. Lemon Squeezy seçeneğini seçin
3. Test ödeme yapın (test modunda)

## 8. Production'a Geçiş

### Test Mode'dan Production'a:
1. Lemon Squeezy Dashboard'da **"Live Mode"** aktif edin
2. Production API keys'lerini alın
3. `.env` dosyasını production keys'leriyle güncelleyin
4. Webhook URL'ini production domain'e güncelleyin

## 9. Önemli Notlar

### Güvenlik
- API key'lerinizi asla public repository'de paylaşmayın
- Webhook secret'ınızı güçlü tutun
- HTTPS kullanın (webhook'lar için zorunlu)

### Para Birimleri
- Lemon Squeezy otomatik para birimi dönüşümü yapar
- Türk kullanıcılar için TRY, yabancı kullanıcılar için USD kullanabilirsiniz

### Vergi Yönetimi
- Lemon Squeezy otomatik vergi hesaplama yapar
- EU VAT, US Sales Tax vb. otomatik eklenir

## 10. Sorun Giderme

### Yaygın Hatalar
1. **Invalid API Key**: API key'in doğru kopyalandığından emin olun
2. **Webhook Verification Failed**: Secret'ın doğru olduğunu kontrol edin
3. **Variant Not Found**: Variant ID'nin doğru olduğunu kontrol edin

### Debug İpuçları
- Lemon Squeezy Dashboard > Webhooks > Logs bölümünden webhook loglarını kontrol edin
- Browser console'da JavaScript hatalarını kontrol edin
- Server loglarında webhook processing hatalarını kontrol edin

## 11. Mevcut Konfigürasyon

✅ **API Key**: Zaten ayarlanmış  
✅ **Store ID**: 235497  
✅ **Variant ID**: 1057551  
✅ **Webhook Route**: `/api/webhooks/lemonsqueezy`  
✅ **Checkout Component**: Hazır  

Sadece gerçek API key'lerinizi `.env` dosyasına eklemeniz yeterli!