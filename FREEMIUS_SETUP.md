# Freemius Kurulum Rehberi

Bu rehber, FastReado uygulamanızda Freemius ile SaaS ödemelerini nasıl aktif hale getireceğinizi gösterir.

## 1. Freemius Hesabı Oluşturma

1. https://dashboard.freemius.com/ adresine gidin
2. "Sign Up" butonuna tıklayın
3. E-posta ve şifre ile hesap oluşturun
4. E-posta doğrulamasını tamamlayın

## 2. Plugin/Product Oluşturma

1. Dashboard'da "Add New Product" butonuna tıklayın
2. Product Type: "SaaS" seçin
3. Product Name: "FastReado" yazın
4. Slug: "fastreado" yazın
5. Description ve diğer bilgileri doldurun
6. "Create Product" butonuna tıklayın

## 3. Plans ve Pricing Oluşturma

### Plan Oluşturma:
1. Product sayfasında "Plans & Pricing" sekmesine gidin
2. "Add Plan" butonuna tıklayın
3. Plan Name: "Premium" yazın
4. Plan ID: "premium" yazın
5. Features listesini doldurun

### Pricing Oluşturma:
1. Plan'ın yanındaki "Add Pricing" butonuna tıklayın
2. Price: $2.99 yazın
3. Currency: USD seçin
4. Billing Cycle: Monthly seçin
5. "Save" butonuna tıklayın

## 4. API Keys Alma

### Developer Dashboard:
1. Sol menüden "Account" > "Billing" > "API" seçin
2. "Generate New Key" butonuna tıklayın
3. Key name: "FastReado API" yazın
4. Permissions: "Read & Write" seçin
5. API Key'i kopyalayın

### Public Key:
1. Product sayfasında "Settings" sekmesine gidin
2. "API" bölümünde Public Key'i bulun
3. Key'i kopyalayın

### Product ID:
1. Product sayfasında URL'deki ID'yi not alın
2. Örnek: `/products/12345` → ID: 12345

## 5. Webhook Kurulumu

1. Product sayfasında "Settings" > "Webhooks" bölümüne gidin
2. "Add Webhook" butonuna tıklayın
3. URL: `https://yourdomain.com/api/webhooks/freemius`
4. Events seçin:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `subscription.expired`
5. Secret key oluşturun ve kaydedin

## 6. .env Dosyasını Güncelleme

`.env` dosyanızda şu değerleri güncelleyin:

```env
# Freemius configuration
FREEMIUS_ID=12345
FREEMIUS_PUBLIC_KEY=pk_1234567890abcdef
FREEMIUS_SECRET_KEY=sk_1234567890abcdef
FREEMIUS_WEBHOOK_SECRET=whsec_1234567890abcdef
```

## 7. Test Etme

### Sandbox Mode:
1. Freemius dashboard'da "Settings" > "General" bölümüne gidin
2. "Sandbox Mode" seçeneğini aktif edin
3. Test ödemeleri yapabilirsiniz

### Test Kartları:
- Visa: 4242424242424242
- Mastercard: 5555555555554444
- Expiry: Gelecekteki herhangi bir tarih
- CVC: Herhangi 3 haneli sayı

## 8. Canlı Moda Geçiş

1. Sandbox mode'u kapatın
2. Gerçek banka hesabı bilgilerinizi ekleyin
3. Tax settings'i yapılandırın
4. Canlı ödemeleri kabul etmeye başlayın

## 9. Freemius Özellikleri

### Avantajları:
- **SaaS Odaklı**: WordPress ve SaaS ürünleri için özel
- **Otomatik Faturalandırma**: Recurring payments
- **Tax Management**: Otomatik vergi hesaplama
- **Analytics**: Detaylı satış raporları
- **Customer Portal**: Kullanıcı self-service
- **Affiliate System**: Ortaklık programı

### Desteklenen Ödeme Yöntemleri:
- Kredi/Debit kartları
- PayPal
- Apple Pay
- Google Pay
- Bank transfers (bazı ülkelerde)

## 10. Webhook Events

Freemius'un gönderdiği önemli events:

```javascript
// Abonelik oluşturuldu
subscription.created

// Abonelik güncellendi
subscription.updated

// Ödeme başarılı
payment.completed

// Ödeme başarısız
payment.failed

// Abonelik iptal edildi
subscription.cancelled

// Abonelik süresi doldu
subscription.expired

// Deneme süresi başladı
trial.started

// Deneme süresi bitti
trial.ended
```

## 11. Sorun Giderme

### Yaygın Sorunlar:

1. **Checkout açılmıyor:**
   - Public key'in doğru olduğundan emin olun
   - Plan ID'lerinin eşleştiğinden emin olun

2. **Webhook çalışmıyor:**
   - URL'nin doğru olduğundan emin olun
   - HTTPS kullandığınızdan emin olun
   - Webhook secret'ın doğru olduğundan emin olun

3. **Ödeme onaylanmıyor:**
   - Event type'ları kontrol edin
   - Custom data'nın doğru parse edildiğinden emin olun

## 12. Faydalı Linkler

- [Freemius Documentation](https://freemius.com/help/)
- [API Reference](https://freemius.com/help/documentation/api/)
- [Webhook Guide](https://freemius.com/help/documentation/webhooks/)
- [Checkout Customization](https://freemius.com/help/documentation/checkout/)
- [Testing Guide](https://freemius.com/help/documentation/testing/)

## 13. Destek

Sorunlarınız için:
- Freemius Support: https://freemius.com/contact/
- Documentation: https://freemius.com/help/
- Community Forum: https://freemius.com/forums/