# Poppler (pdftotext) Windows kurulum scripti
# Bu script Poppler'ı Windows'ta kurar

Write-Host "Poppler (pdftotext) kurulumu başlıyor..." -ForegroundColor Green

# Chocolatey ile kurulum (önerilen)
if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Host "Chocolatey bulundu, Poppler kuruluyor..." -ForegroundColor Yellow
    choco install poppler -y
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Poppler başarıyla kuruldu!" -ForegroundColor Green
        Write-Host "pdftotext komutu artık kullanılabilir." -ForegroundColor Green
        
        # Test et
        Write-Host "Test ediliyor..." -ForegroundColor Yellow
        pdftotext -v
        exit 0
    }
}

# Scoop ile kurulum (alternatif)
if (Get-Command scoop -ErrorAction SilentlyContinue) {
    Write-Host "Scoop bulundu, Poppler kuruluyor..." -ForegroundColor Yellow
    scoop install poppler
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Poppler başarıyla kuruldu!" -ForegroundColor Green
        Write-Host "pdftotext komutu artık kullanılabilir." -ForegroundColor Green
        
        # Test et
        Write-Host "Test ediliyor..." -ForegroundColor Yellow
        pdftotext -v
        exit 0
    }
}

# Manuel kurulum talimatları
Write-Host "Otomatik kurulum başarısız oldu." -ForegroundColor Red
Write-Host ""
Write-Host "Manuel kurulum için:" -ForegroundColor Yellow
Write-Host "1. https://github.com/oschwartz10612/poppler-windows/releases adresinden poppler'ı indirin"
Write-Host "2. ZIP dosyasını C:\poppler gibi bir klasöre çıkarın"
Write-Host "3. C:\poppler\Library\bin klasörünü PATH'e ekleyin"
Write-Host ""
Write-Host "Veya paket yöneticisi kurun:" -ForegroundColor Yellow
Write-Host "Chocolatey: https://chocolatey.org/install"
Write-Host "Scoop: https://scoop.sh/"
Write-Host ""
Write-Host "Kurulum tamamlandıktan sonra 'pdftotext -v' komutuyla test edin."

exit 1