# Coinbase Commerce Kurulum Rehberi

Bu rehber, FastReado uygulamanızda Coinbase Commerce ile kripto para ödemelerini nasıl aktif hale getireceğinizi gösterir.

## 1. Coinbase Commerce Hesabı Oluşturma

1. https://commerce.coinbase.com/ adresine gidin
2. "Get Started" butonuna tıklayın
3. E-posta ve şifre ile hesap oluşturun
4. E-posta doğrulamasını tamamlayın
5. İş bilgilerinizi doldurun

## 2. API Key'lerini Alma

### API Key:
1. Coinbase Commerce dashboard'a girin
2. Sol menüden "Settings" > "API Keys" seçin
3. "Create an API Key" butonuna tıklayın
4. Key'i kopyalayın ve güvenli bir yerde saklayın

### Webhook Secret:
1. "Settings" > "Webhook subscriptions" bölümüne gidin
2. "Add an endpoint" butonuna tıklayın
3. Endpoint URL: `https://yourdomain.com/api/webhooks/coinbase`
4. Events seçin: `charge:created`, `charge:confirmed`, `charge:failed`
5. Webhook secret'ı kopyalayın

## 3. .env Dosyasını Güncelleme

`.env` dosyanızda şu değerleri güncelleyin:

```env
# Coinbase Commerce configuration
COINBASE_COMMERCE_API_KEY=your_actual_api_key_here
COINBASE_COMMERCE_WEBHOOK_SECRET=your_actual_webhook_secret_here
```

## 4. Desteklenen Kripto Paralar

Coinbase Commerce aşağıdaki kripto paraları destekler:

- **Bitcoin (BTC)**
- **Ethereum (ETH)**
- **Bitcoin Cash (BCH)**
- **Litecoin (LTC)**
- **USD Coin (USDC)**
- **DAI**
- **Dogecoin (DOGE)**

## 5. Test Etme

### Test Modunda:
1. Coinbase Commerce dashboard'da "Settings" > "General" bölümüne gidin
2. "Test mode" seçeneğini aktif edin
3. Test API key'lerini kullanın

### Canlı Modda:
1. Test mode'u kapatın
2. Canlı API key'lerini kullanın
3. Gerçek kripto para ödemeleri alabilirsiniz

## 6. Webhook Testi

Webhook'unuzun çalışıp çalışmadığını test etmek için:

1. Coinbase Commerce'de test ödeme oluşturun
2. Console loglarını kontrol edin
3. Webhook endpoint'inizin 200 status döndürdüğünden emin olun

## 7. Güvenlik Notları

- API key'lerinizi asla public repository'lerde paylaşmayın
- Webhook signature doğrulamasını mutlaka aktif tutun
- HTTPS kullanın
- Rate limiting uygulayın

## 8. Sorun Giderme

### Yaygın Sorunlar:

1. **Webhook çalışmıyor:**
   - URL'nin doğru olduğundan emin olun
   - HTTPS kullandığınızdan emin olun
   - Signature doğrulamasını kontrol edin

2. **API hatası:**
   - API key'in doğru olduğundan emin olun
   - Rate limit'e takılmadığınızdan emin olun

3. **Ödeme onaylanmıyor:**
   - Webhook event'lerini kontrol edin
   - Database bağlantısını kontrol edin

## 9. Faydalı Linkler

- [Coinbase Commerce Docs](https://commerce.coinbase.com/docs/)
- [API Reference](https://commerce.coinbase.com/docs/api/)
- [Webhook Guide](https://commerce.coinbase.com/docs/api/#webhooks)
- [Test Mode](https://commerce.coinbase.com/docs/api/#testing)

## 10. Destek

Sorunlarınız için:
- Coinbase Commerce Support: https://help.coinbase.com/
- Developer Docs: https://commerce.coinbase.com/docs/