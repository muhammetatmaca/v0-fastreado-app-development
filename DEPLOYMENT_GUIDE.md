# FastReado Deployment Rehberi

Bu rehber, FastReado projenizi canlıya almak için adım adım talimatlar içerir.

## 🚀 Vercel ile Deployment (Önerilen)

### Neden Vercel?
- Next.js'in yaratıcısı Vercel tarafından optimize edilmiş
- Ücretsiz plan ile başlayabilirsiniz
- Otomatik HTTPS ve CDN
- GitHub ile otomatik deployment
- Serverless functions desteği

### Adım 1: GitHub Repository Hazırlama

1. **GitHub'da yeni repository oluşturun:**
   ```bash
   # Terminal'de proje klasörünüzde
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/fastreado.git
   git push -u origin main
   ```

2. **Environment variables'ları hazırlayın:**
   - `.env` dosyanızdaki tüm değişkenleri not alın
   - Production için güncellenecek değerler:
     - `NEXT_PUBLIC_APP_URL`
     - `MONGODB_URI` (production database)
     - Webhook URL'leri

### Adım 2: Vercel Hesabı ve Deployment

1. **Vercel hesabı oluşturun:**
   - https://vercel.com adresine gidin
   - "Sign up with GitHub" ile kayıt olun

2. **Projeyi import edin:**
   - Dashboard'da "New Project" butonuna tıklayın
   - GitHub repository'nizi seçin
   - "Import" butonuna tıklayın

3. **Environment Variables ekleyin:**
   - Project settings > Environment Variables
   - `.env` dosyanızdaki tüm değişkenleri ekleyin
   - Production değerleri ile güncelleyin

4. **Deploy edin:**
   - "Deploy" butonuna tıklayın
   - 2-3 dakika içinde canlıya çıkar

### Adım 3: Domain ve SSL

1. **Otomatik domain:**
   - Vercel otomatik olarak `your-project.vercel.app` domain verir
   - HTTPS otomatik olarak aktif

2. **Custom domain (opsiyonel):**
   - Project settings > Domains
   - Kendi domain'inizi ekleyebilirsiniz

## 🌐 Netlify ile Deployment

### Adım 1: Build Ayarları

1. **netlify.toml dosyası oluşturun:**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Package.json'da export script ekleyin:**
   ```json
   {
     "scripts": {
       "export": "next build && next export"
     }
   }
   ```

### Adım 2: Netlify Deployment

1. **Netlify'da hesap oluşturun:**
   - https://netlify.com
   - GitHub ile giriş yapın

2. **Site deploy edin:**
   - "New site from Git" seçin
   - Repository'nizi seçin
   - Build command: `npm run build`
   - Publish directory: `.next`

## 🚂 Railway ile Deployment

### Adım 1: Railway Hesabı

1. **Railway hesabı oluşturun:**
   - https://railway.app
   - GitHub ile giriş yapın

2. **Yeni proje oluşturun:**
   - "New Project" > "Deploy from GitHub repo"
   - Repository'nizi seçin

### Adım 2: Database Setup

1. **MongoDB ekleme:**
   - "Add Service" > "Database" > "MongoDB"
   - Connection string'i environment variables'a ekleyin

2. **Environment Variables:**
   - Tüm `.env` değişkenlerini ekleyin
   - Railway otomatik olarak PORT ayarlar

## 📋 Production Environment Variables

### Güncellenecek Değerler:

```env
# Production URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# MongoDB (Production database)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fastreado_prod

# Webhook URLs (production domain ile)
# Stripe
STRIPE_WEBHOOK_ENDPOINT_SECRET=whsec_production_key

# Lemon Squeezy
LEMONSQUEEZY_WEBHOOK_SECRET=production_secret

# Coinbase Commerce
COINBASE_COMMERCE_WEBHOOK_SECRET=production_secret

# Polar.sh
POLAR_WEBHOOK_SECRET=production_secret

# Freemius
FREEMIUS_WEBHOOK_SECRET=production_secret
```

## 🔧 Webhook URL'lerini Güncelleme

Deployment sonrası her ödeme sağlayıcısında webhook URL'lerini güncelleyin:

### Stripe:
- Dashboard > Webhooks
- URL: `https://your-domain.vercel.app/api/webhooks/stripe`

### Lemon Squeezy:
- Settings > Webhooks
- URL: `https://your-domain.vercel.app/api/webhooks/lemonsqueezy`

### Coinbase Commerce:
- Settings > Webhook subscriptions
- URL: `https://your-domain.vercel.app/api/webhooks/coinbase`

### Polar.sh:
- Organization settings > Webhooks
- URL: `https://your-domain.vercel.app/api/webhooks/polar`

### Freemius:
- Product settings > Webhooks
- URL: `https://your-domain.vercel.app/api/webhooks/freemius`

## 🎨 Custom Domain Kurulumu

### Vercel ile Custom Domain:

1. **Domain satın alın:**
   - Namecheap, GoDaddy, Cloudflare vb.

2. **Vercel'de domain ekleyin:**
   - Project settings > Domains
   - Domain'inizi ekleyin

3. **DNS ayarları:**
   - A record: `76.76.19.61`
   - CNAME record: `cname.vercel-dns.com`

## 📊 Performance Optimizasyonu

### Next.js Optimizasyonları:

1. **next.config.js güncelleyin:**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     images: {
       domains: ['res.cloudinary.com'],
     },
     compress: true,
     poweredByHeader: false,
   }

   module.exports = nextConfig
   ```

2. **Bundle analyzer ekleyin:**
   ```bash
   npm install @next/bundle-analyzer
   ```

## 🔒 Güvenlik Ayarları

### Production Güvenlik:

1. **Environment variables kontrolü:**
   - Tüm secret key'lerin production değerleri
   - Debug mode'un kapalı olması

2. **CORS ayarları:**
   - Sadece kendi domain'inizden isteklere izin

3. **Rate limiting:**
   - API endpoint'leri için rate limiting

## 📈 Monitoring ve Analytics

### Vercel Analytics:
- Otomatik olarak aktif
- Real-time visitor tracking

### Error Monitoring:
- Sentry entegrasyonu önerilir
- Production hataları için

## 🚀 Go Live Checklist

- [ ] GitHub repository hazır
- [ ] Environment variables production için güncellendi
- [ ] MongoDB production database hazır
- [ ] Vercel/Netlify/Railway hesabı oluşturuldu
- [ ] Proje deploy edildi
- [ ] Custom domain bağlandı (opsiyonel)
- [ ] SSL sertifikası aktif
- [ ] Webhook URL'leri güncellendi
- [ ] Ödeme sağlayıcıları test edildi
- [ ] Performance testi yapıldı
- [ ] Error monitoring kuruldu

## 💡 Pro Tips

1. **Staging Environment:**
   - Production'dan önce staging ortamı kurun
   - Test ödemelerini staging'de yapın

2. **Backup Strategy:**
   - Database backup'ları düzenli alın
   - Code repository'yi güncel tutun

3. **Monitoring:**
   - Uptime monitoring kurun
   - Performance metrikleri takip edin

4. **SEO:**
   - Google Search Console ekleyin
   - Sitemap.xml oluşturun

## 📞 Destek

Deployment sırasında sorun yaşarsanız:
- Vercel Discord: https://discord.gg/vercel
- Netlify Support: https://netlify.com/support
- Railway Discord: https://discord.gg/railway