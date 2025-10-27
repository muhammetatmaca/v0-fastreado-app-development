# Hetzner Sunucu Deployment Rehberi

Bu rehber, FastReado projenizi Hetzner sunucunuzda farklı port ile çalıştırmak için gerekli adımları içerir.

## 🖥️ Hetzner Sunucu Kurulumu

### Port Yapılandırması

Mevcut 3000 portunda başka uygulama çalıştığı için farklı port kullanacağız.

### 1. Port Seçimi

Önerilen portlar:
- **3009** - FastReado için (seçilen port)
- **3001** - Alternatif
- **8080** - Web uygulamaları için yaygın
- **4000** - Node.js uygulamaları için yaygın

## 📝 Package.json Güncelleme

```json
{
  "scripts": {
    "dev": "next dev -p 3009",
    "start": "next start -p 3009",
    "build": "next build",
    "lint": "eslint ."
  }
}
```

## 🔧 Environment Variables Güncelleme

`.env` dosyanızda:

```env
# Port configuration
PORT=3009

# Public app URL (Hetzner sunucu IP'niz ile)
NEXT_PUBLIC_APP_URL=http://YOUR_SERVER_IP:3009

# Diğer tüm environment variables...
```

## 🚀 Hetzner Sunucuda Kurulum

### Adım 1: Sunucuya Bağlanma

```bash
# SSH ile sunucuya bağlan
ssh root@YOUR_SERVER_IP

# Veya kullanıcı hesabı ile
ssh username@YOUR_SERVER_IP
```

### Adım 2: Gerekli Yazılımları Kurma

```bash
# Node.js kurulumu (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 kurulumu (process manager)
sudo npm install -g pm2

# Git kurulumu
sudo apt update
sudo apt install git
```

### Adım 3: Proje Klonlama

```bash
# Proje klasörüne git
cd /var/www

# Repository klonla
git clone https://github.com/USERNAME/fastreado.git

# Proje klasörüne gir
cd fastreado

# Dependencies kur
npm install

# Build al
npm run build
```

### Adım 4: Environment Variables Ayarlama

```bash
# .env dosyası oluştur
nano .env

# Aşağıdaki içeriği yapıştır ve güncelle:
```

```env
# Port configuration
PORT=3001

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://muhammetatmaca79_db_user:G6IxSaG00W9teU48@cluster0.1errx4j.mongodb.net/fastreado?retryWrites=true&w=majority&appName=Cluster0

# JWT secret
JWT_SECRET=7f9c3b5d-9a41-4b8f-8c73-2d3e5a6f1b2c

# SMTP configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=muhammetatmaca79@gmail.com
SMTP_PASS="gnyr bndq fonc sjtb"
FROM_EMAIL="Muhammet <muhammetatmaca79@gmail.com>"

# Public app URL (Hetzner sunucu IP'niz ile)
NEXT_PUBLIC_APP_URL=http://YOUR_SERVER_IP:3001

# Cloudinary configuration
CLOUDINARY_URL=cloudinary://321447734348935:zNAQWHLN1G1F4yhL3ElJj8rw2Xc@dlotlb4nz
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dlotlb4nz

# Lemon Squeezy configuration
LEMONSQUEEZY_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
LEMONSQUEEZY_STORE_ID=235497
LEMONSQUEEZY_WEBHOOK_SECRET=muhammet

# Diğer ödeme sağlayıcıları...
```

### Adım 5: PM2 ile Çalıştırma

```bash
# PM2 ecosystem dosyası oluştur
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'fastreado',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/fastreado',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3009
    }
  }]
}
```

```bash
# PM2 ile başlat
pm2 start ecosystem.config.js

# PM2'yi sistem başlangıcında çalıştır
pm2 startup
pm2 save
```

## 🔥 Firewall Ayarları

```bash
# UFW firewall kullanıyorsanız
sudo ufw allow 3009

# iptables kullanıyorsanız
sudo iptables -A INPUT -p tcp --dport 3009 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

## 🌐 Nginx Reverse Proxy (Önerilen)

Domain kullanmak istiyorsanız Nginx reverse proxy kurun:

### Nginx Kurulumu

```bash
sudo apt install nginx
```

### Nginx Konfigürasyonu

```bash
sudo nano /etc/nginx/sites-available/fastreado
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3009;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Site'ı aktif et
sudo ln -s /etc/nginx/sites-available/fastreado /etc/nginx/sites-enabled/

# Nginx'i test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

## 🔒 SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kur
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 📊 Monitoring ve Loglar

### PM2 Komutları

```bash
# Durum kontrol
pm2 status

# Logları görüntüle
pm2 logs fastreado

# Uygulamayı yeniden başlat
pm2 restart fastreado

# Uygulamayı durdur
pm2 stop fastreado

# Uygulamayı sil
pm2 delete fastreado
```

### Sistem Logları

```bash
# Nginx logları
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Sistem logları
journalctl -u nginx -f
```

## 🔄 Otomatik Deployment Script

```bash
# deploy.sh dosyası oluştur
nano deploy.sh
```

```bash
#!/bin/bash

echo "🚀 FastReado Deployment Starting..."

# Git pull
git pull origin main

# Dependencies güncelle
npm install

# Build al
npm run build

# PM2 ile yeniden başlat
pm2 restart fastreado

echo "✅ Deployment completed!"
```

```bash
# Script'i çalıştırılabilir yap
chmod +x deploy.sh

# Çalıştır
./deploy.sh
```

## 🌍 Webhook URL'lerini Güncelleme

Deployment sonrası tüm ödeme sağlayıcılarında webhook URL'lerini güncelleyin:

### Stripe:
```
http://YOUR_SERVER_IP:3009/api/webhooks/stripe
```

### Lemon Squeezy:
```
http://YOUR_SERVER_IP:3009/api/webhooks/lemonsqueezy
```

### Coinbase Commerce:
```
http://YOUR_SERVER_IP:3009/api/webhooks/coinbase
```

### Polar.sh:
```
http://YOUR_SERVER_IP:3009/api/webhooks/polar
```

### Freemius:
```
http://YOUR_SERVER_IP:3009/api/webhooks/freemius
```

## 🔧 Sorun Giderme

### Port Kontrolü

```bash
# Port 3009'un kullanılıp kullanılmadığını kontrol et
sudo netstat -tlnp | grep :3009

# Process'i öldür (gerekirse)
sudo kill -9 PID_NUMBER
```

### Uygulama Logları

```bash
# PM2 logları
pm2 logs fastreado --lines 100

# Real-time loglar
pm2 logs fastreado -f
```

### Performans Monitoring

```bash
# PM2 monitoring
pm2 monit

# Sistem kaynakları
htop
```

## 📋 Deployment Checklist

- [ ] Node.js kuruldu
- [ ] PM2 kuruldu
- [ ] Proje klonlandı
- [ ] Dependencies kuruldu
- [ ] Build alındı
- [ ] Environment variables ayarlandı
- [ ] Port 3009 açıldı
- [ ] PM2 ile başlatıldı
- [ ] Firewall ayarları yapıldı
- [ ] Nginx reverse proxy kuruldu (opsiyonel)
- [ ] SSL sertifikası alındı (opsiyonel)
- [ ] Webhook URL'leri güncellendi
- [ ] Test edildi

## 🎯 Hızlı Başlangıç Komutları

```bash
# Sunucuya bağlan
ssh root@YOUR_SERVER_IP

# Proje klasörüne git
cd /var/www/fastreado

# Güncellemeleri çek
git pull

# Yeniden başlat
pm2 restart fastreado

# Durumu kontrol et
pm2 status
```

## 💡 Pro Tips

1. **Backup**: Düzenli database backup alın
2. **Monitoring**: Uptime monitoring kurun
3. **Security**: Fail2ban kurun
4. **Performance**: Redis cache ekleyin
5. **Logs**: Log rotation ayarlayın

Bu rehberle Hetzner sunucunuzda FastReado'yu 3009 portunda çalıştırabilirsiniz!