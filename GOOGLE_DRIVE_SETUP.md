# Google Drive Entegrasyonu Kurulum Rehberi

Bu rehber, Fastreado uygulamasında Google Drive entegrasyonunu kurmak için gerekli adımları açıklar.

## 1. Google Cloud Console Kurulumu

### Adım 1: Proje Oluşturma
1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. Proje adını "Fastreado" olarak belirleyin

### Adım 2: Google Drive API'yi Etkinleştirme
1. Sol menüden "APIs & Services" > "Library" seçin
2. "Google Drive API" aratın ve seçin
3. "Enable" butonuna tıklayın

### Adım 3: Service Account Oluşturma
1. "APIs & Services" > "Credentials" seçin
2. "Create Credentials" > "Service Account" seçin
3. Service account adını "fastreado-drive-service" olarak belirleyin
4. "Create and Continue" tıklayın
5. Role olarak "Editor" seçin (veya daha kısıtlı: "Storage Admin")
6. "Done" tıklayın

### Adım 4: Service Account Key Oluşturma
1. Oluşturulan service account'a tıklayın
2. "Keys" sekmesine gidin
3. "Add Key" > "Create new key" seçin
4. "JSON" formatını seçin ve "Create" tıklayın
5. İndirilen JSON dosyasını güvenli bir yerde saklayın

## 2. Google Drive Klasör Yapısı

### Ana Klasörler Oluşturma
Google Drive'ınızda aşağıdaki klasör yapısını oluşturun:

```
Fastreado/
├── public_books/          # Genel erişilebilir kitaplar
│   ├── nutuk.pdf
│   ├── safahat.pdf
│   └── ...
└── user_uploads/          # Kullanıcı yüklemeleri
    ├── user_123456/       # Her kullanıcı için ayrı klasör
    ├── user_789012/
    └── ...
```

### Klasör ID'lerini Alma
1. Google Drive'da oluşturduğunuz klasöre gidin
2. URL'den klasör ID'sini kopyalayın
   - Örnek URL: `https://drive.google.com/drive/folders/1ABC123DEF456GHI789`
   - Klasör ID: `1ABC123DEF456GHI789`

## 3. Environment Variables Kurulumu

`.env` dosyanızda aşağıdaki değişkenleri güncelleyin:

```env
# Google Drive Klasör ID'leri
GOOGLE_DRIVE_PUBLIC_BOOKS_FOLDER_ID=your_public_books_folder_id
GOOGLE_DRIVE_USER_UPLOADS_FOLDER_ID=your_user_uploads_folder_id

# Google Service Account Bilgileri
GOOGLE_SERVICE_ACCOUNT_EMAIL=fastreado-drive-service@your-project-id.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

### Service Account Bilgilerini Alma
İndirdiğiniz JSON dosyasından:
- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

## 4. Service Account İzinleri

### Klasörlere Erişim Verme
1. Google Drive'da `public_books` klasörüne sağ tıklayın
2. "Share" seçin
3. Service account email adresini ekleyin
4. "Editor" yetkisi verin
5. Aynı işlemi `user_uploads` klasörü için tekrarlayın

## 5. Test Etme

### PDF Yükleme Testi
1. Uygulamayı başlatın: `pnpm dev`
2. Giriş yapın veya kayıt olun
3. "PDF'lerim" sayfasına gidin
4. Test PDF'i yükleyin
5. Google Drive'da `user_uploads/user_[USER_ID]/` klasöründe dosyanın oluştuğunu kontrol edin

### Hata Ayıklama
Yaygın hatalar ve çözümleri:

#### "Service account not found"
- Service account email adresinin doğru olduğunu kontrol edin
- JSON dosyasındaki `client_email` değerini kullandığınızdan emin olun

#### "Insufficient permissions"
- Service account'a klasör erişimi verdiğinizden emin olun
- "Editor" yetkisi verildiğini kontrol edin

#### "Invalid private key"
- Private key'in tam olarak kopyalandığını kontrol edin
- `\n` karakterlerinin korunduğundan emin olun
- Tırnak işaretleri içinde olduğunu kontrol edin

## 6. Güvenlik Önerileri

### Production Ortamı
1. Service account için minimum gerekli yetkileri verin
2. Private key'i environment variable olarak saklayın
3. JSON dosyasını güvenli bir yerde saklayın ve paylaşmayın
4. Düzenli olarak access log'larını kontrol edin

### Geliştirme Ortamı
1. Test klasörleri kullanın
2. Gerçek kullanıcı verilerini test ortamında kullanmayın
3. `.env` dosyasını git'e commit etmeyin

## 7. Alternatif Kurulum (Manuel)

Eğer API entegrasyonu çalışmıyorsa, manuel yükleme yapabilirsiniz:

### Manuel PDF Yükleme
1. PDF'i Google Drive'a manuel olarak yükleyin
2. Dosyaya sağ tıklayın > "Share" > "Get link"
3. "Anyone with the link can view" seçin
4. Link'ten file ID'yi alın
5. Veritabanında kullanıcının PDF listesine ekleyin

### File ID Alma
Google Drive link'i: `https://drive.google.com/file/d/1ABC123DEF456GHI789/view`
File ID: `1ABC123DEF456GHI789`

## 8. Monitoring ve Bakım

### Kullanım İstatistikleri
- Google Cloud Console'da API kullanım istatistiklerini takip edin
- Quota limitlerini kontrol edin
- Hata oranlarını izleyin

### Düzenli Bakım
- Eski dosyaları temizleyin
- Kullanılmayan service account'ları kaldırın
- İzinleri düzenli olarak gözden geçirin

## Destek

Kurulum sırasında sorun yaşarsanız:
1. Console log'larını kontrol edin
2. Google Cloud Console'da error log'larına bakın
3. API quota'larını kontrol edin
4. Service account izinlerini doğrulayın

Bu rehberi takip ederek Google Drive entegrasyonunu başarıyla kurabilirsiniz.