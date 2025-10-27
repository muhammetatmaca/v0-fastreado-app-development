# Polar.sh Kurulum Rehberi

Bu rehber, FastReado uygulamanızda Polar.sh ile açık kaynak odaklı ödemelerini nasıl aktif hale getireceğinizi gösterir.

## 1. Polar.sh Nedir?

Polar.sh, açık kaynak geliştiriciler ve GitHub projeleri için özel olarak tasarlanmış modern bir ödeme platformudur. GitHub sponsorları, abonelikler ve tek seferlik ödemeler için optimize edilmiştir.

### Temel Özellikler:
- **GitHub Entegrasyonu**: Doğrudan GitHub hesabınızla bağlantı
- **Sponsor Yönetimi**: GitHub Sponsors alternatifi
- **Abonelik Sistemi**: Recurring payments
- **Tek Seferlik Ödemeler**: One-time purchases
- **Developer Friendly**: API-first yaklaşım
- **Şeffaflık**: Açık kaynak projeleri için şeffaf gelir raporları

## 2. Hesap Oluşturma

1. https://polar.sh/ adresine gidin
2. "Sign up with GitHub" butonuna tıklayın
3. GitHub hesabınızla giriş yapın
4. Organization permissions'ı onaylayın
5. Profile bilgilerinizi tamamlayın

## 3. Organization Kurulumu

### Organization Oluşturma:
1. Dashboard'da "Create Organization" butonuna tıklayın
2. Organization name: "FastReado" yazın
3. GitHub repository'nizi bağlayın (opsiyonel)
4. Description ve avatar ekleyin
5. "Create" butonuna tıklayın

### Organization ID Alma:
1. Organization settings sayfasına gidin
2. URL'deki organization ID'yi not alın
3. Örnek: `/orgs/org_1234567890abcdef` → ID: `org_1234567890abcdef`

## 4. Products ve Pricing Oluşturma

### Product Oluşturma:
1. Organization dashboard'da "Products" sekmesine gidin
2. "Create Product" butonuna tıklayın
3. Product details:
   - Name: "FastReado Premium"
   - Description: "Premium reading features"
   - Type: "Recurring" seçin
4. "Create Product" butonuna tıklayın

### Pricing Oluşturma:
1. Product sayfasında "Add Price" butonuna tıklayın
2. Price details:
   - Amount: $2.99
   - Currency: USD
   - Interval: Monthly
   - Name: "Premium Monthly"
3. "Create Price" butonuna tıklayın
4. Price ID'yi not alın (örnek: `price_1234567890abcdef`)

## 5. API Keys Alma

### Access Token:
1. Settings > "Developer" bölümüne gidin
2. "Personal Access Tokens" sekmesine tıklayın
3. "Create Token" butonuna tıklayın
4. Token name: "FastReado API" yazın
5. Scopes seçin:
   - `products:read`
   - `products:write`
   - `checkouts:read`
   - `checkouts:write`
   - `subscriptions:read`
   - `subscriptions:write`
6. "Create Token" butonuna tıklayın
7. Token'ı kopyalayın ve güvenli bir yerde saklayın

## 6. Webhook Kurulumu

### Webhook Endpoint Oluşturma:
1. Organization settings > "Webhooks" bölümüne gidin
2. "Add Webhook" butonuna tıklayın
3. Webhook details:
   - URL: `https://yourdomain.com/api/webhooks/polar`
   - Events seçin:
     - `checkout.completed`
     - `subscription.created`
     - `subscription.updated`
     - `subscription.cancelled`
     - `subscription.expired`
4. Secret key oluşturun ve kaydedin
5. "Create Webhook" butonuna tıklayın

## 7. .env Dosyasını Güncelleme

`.env` dosyanızda şu değerleri güncelleyin:

```env
# Polar.sh configuration
POLAR_ACCESS_TOKEN=polar_pat_1234567890abcdef
POLAR_ORGANIZATION_ID=org_1234567890abcdef
POLAR_WEBHOOK_SECRET=whsec_1234567890abcdef
POLAR_PREMIUM_PRICE_ID=price_1234567890abcdef
POLAR_BASIC_PRICE_ID=price_0987654321fedcba
```

## 8. Polar.sh'ın Ödeme Sistemi

### Desteklenen Ödeme Yöntemleri:
- **Kredi/Debit Kartları**: Visa, Mastercard, American Express
- **Digital Wallets**: Apple Pay, Google Pay
- **Bank Transfers**: ACH (ABD), SEPA (Avrupa)
- **GitHub Billing**: GitHub hesabı üzerinden ödeme

### Ödeme Akışı:
1. **Checkout Creation**: API ile checkout session oluşturulur
2. **User Redirect**: Kullanıcı Polar.sh checkout sayfasına yönlendirilir
3. **Payment Processing**: Kullanıcı ödeme bilgilerini girer
4. **Webhook Notification**: Ödeme tamamlandığında webhook gönderilir
5. **Account Upgrade**: Webhook ile kullanıcı hesabı güncellenir

## 9. GitHub Entegrasyonu

### GitHub Sponsors Alternatifi:
- Polar.sh, GitHub Sponsors'a alternatif sunar
- Daha düşük komisyon oranları (%2.9 + $0.30)
- Daha fazla ödeme seçeneği
- Gelişmiş analytics ve raporlama

### Repository Bağlantısı:
1. Organization settings > "GitHub" bölümüne gidin
2. "Connect Repository" butonuna tıklayın
3. Repository'nizi seçin
4. Permissions'ı onaylayın

## 10. Test Etme

### Test Mode:
1. Organization settings > "General" bölümüne gidin
2. "Test Mode" seçeneğini aktif edin
3. Test ödemeleri yapabilirsiniz

### Test Kartları:
- Visa: 4242424242424242
- Mastercard: 5555555555554444
- Expiry: Gelecekteki herhangi bir tarih
- CVC: Herhangi 3 haneli sayı

## 11. Canlı Moda Geçiş

### Stripe Connect:
1. Polar.sh, Stripe Connect kullanır
2. Stripe hesabınızı bağlamanız gerekir
3. KYC (Know Your Customer) sürecini tamamlayın
4. Bank account bilgilerinizi ekleyin

### Payout Settings:
1. Settings > "Payouts" bölümüne gidin
2. Payout schedule'ı ayarlayın (günlük, haftalık, aylık)
3. Minimum payout amount'ı belirleyin

## 12. Analytics ve Raporlama

### Dashboard Metrikleri:
- **Revenue**: Toplam gelir
- **Subscribers**: Aktif aboneler
- **Conversion Rate**: Dönüşüm oranı
- **Churn Rate**: İptal oranı
- **MRR**: Monthly Recurring Revenue

### Export Options:
- CSV export
- API access
- Webhook data
- Custom reports

## 13. Avantajları

### Geliştiriciler İçin:
- **Düşük Komisyon**: %2.9 + $0.30 (GitHub Sponsors: %3.0)
- **API-First**: Güçlü API ve webhook sistemi
- **GitHub Integration**: Seamless GitHub workflow
- **Transparency**: Açık gelir raporları
- **Community Focus**: Açık kaynak topluluğu odaklı

### Kullanıcılar İçin:
- **Güvenli Ödeme**: Stripe altyapısı
- **Çoklu Ödeme Seçenekleri**: Kart, wallet, bank transfer
- **GitHub Login**: Kolay hesap oluşturma
- **Subscription Management**: Self-service portal

## 14. Webhook Events

Polar.sh'ın gönderdiği önemli events:

```javascript
// Checkout tamamlandı
checkout.completed

// Abonelik oluşturuldu
subscription.created

// Abonelik güncellendi
subscription.updated

// Ödeme başarılı
subscription.payment_succeeded

// Ödeme başarısız
subscription.payment_failed

// Abonelik iptal edildi
subscription.cancelled

// Abonelik süresi doldu
subscription.expired

// Refund işlemi
refund.created
```

## 15. Sorun Giderme

### Yaygın Sorunlar:

1. **Checkout oluşturulamıyor:**
   - Access token'ın doğru olduğundan emin olun
   - Organization ID'nin doğru olduğundan emin olun
   - Price ID'lerinin aktif olduğundan emin olun

2. **Webhook çalışmıyor:**
   - URL'nin HTTPS olduğundan emin olun
   - Webhook secret'ın doğru olduğundan emin olun
   - Event types'ların seçili olduğundan emin olun

3. **Ödeme başarısız:**
   - Stripe Connect kurulumunu kontrol edin
   - Test mode/live mode ayarlarını kontrol edin

## 16. Faydalı Linkler

- [Polar.sh Documentation](https://docs.polar.sh/)
- [API Reference](https://docs.polar.sh/api/)
- [Webhook Guide](https://docs.polar.sh/webhooks/)
- [GitHub Integration](https://docs.polar.sh/github/)
- [Stripe Connect Setup](https://docs.polar.sh/payouts/)

## 17. Destek

Sorunlarınız için:
- Polar.sh Support: support@polar.sh
- Documentation: https://docs.polar.sh/
- Discord Community: https://discord.gg/polar
- GitHub Issues: https://github.com/polarsource/polar