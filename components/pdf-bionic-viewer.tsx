"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Settings, BookOpen, Eye, Minus, Plus, FileText, Maximize2 } from 'lucide-react'
import { transformTextToBionic, BionicSettings, defaultBionicSettings } from '@/lib/bionic-reading'

interface PdfBionicViewerProps {
  driveFileId: string
  title: string
  onSettingsChange?: (settings: BionicSettings) => void
}

export function PdfBionicViewer({ driveFileId, title, onSettingsChange }: PdfBionicViewerProps) {
  const [settings, setSettings] = useState<BionicSettings>(defaultBionicSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [viewMode, setViewMode] = useState<'pdf' | 'bionic' | 'split'>('split')
  const [sampleText, setSampleText] = useState('')

  // PDF'den gerçek text çıkar
  useEffect(() => {
    const extractRealText = async () => {
      try {
        const response = await fetch('/api/extract-pdf-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            driveFileId,
            isGoogleDrive: true
          })
        })

        const result = await response.json()
        
        if (result.success && result.text) {
          setSampleText(result.text)
        } else {
          // Fallback to book-specific text
          setSampleText(getBookSpecificText(title))
        }
      } catch (error) {
        console.error('Text extraction error:', error)
        // Fallback to book-specific text
        setSampleText(getBookSpecificText(title))
      }
    }

    extractRealText()
  }, [driveFileId, title])

  // Settings değiştiğinde callback çağır
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange(settings)
    }
  }, [settings, onSettingsChange])

  const handleFixationChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, fixationStrength: value[0] }))
  }

  const handleSaccadeChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, saccadeStrength: value[0] }))
  }

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12))
  }

  const getGoogleDriveEmbedUrl = (fileId: string) => {
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Kontrol Paneli */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* View Mode Buttons */}
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'pdf' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('pdf')}
                  className="text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  PDF
                </Button>
                <Button
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('split')}
                  className="text-xs"
                >
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Yan Yana
                </Button>
                <Button
                  variant={viewMode === 'bionic' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('bionic')}
                  className="text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Bionic
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Ayarlar
              </Button>
            </div>
          </div>
        </CardHeader>

        {showSettings && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fixation Strength */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Vurgulama Gücü: {settings.fixationStrength}
                </label>
                <Slider
                  value={[settings.fixationStrength]}
                  onValueChange={handleFixationChange}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Kelimelerin ne kadarının kalın olacağını belirler
                </p>
              </div>

              {/* Saccade Strength */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Okuma Hızı: {settings.saccadeStrength}
                </label>
                <Slider
                  value={[settings.saccadeStrength]}
                  onValueChange={handleSaccadeChange}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Göz hareketlerinin hızını optimize eder
                </p>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Yazı Boyutu: {fontSize}px
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseFontSize}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="flex-1 text-center text-sm">
                    {fontSize}px
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseFontSize}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Okuma konforunuzu ayarlayın
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Viewer */}
        {(viewMode === 'pdf' || viewMode === 'split') && (
          <Card className={viewMode === 'pdf' ? 'lg:col-span-2' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">PDF Görünümü</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-muted/50">
                <iframe
                  src={getGoogleDriveEmbedUrl(driveFileId)}
                  width="100%"
                  height="600"
                  className="border-0"
                  title={title}
                />
              </div>
              <div className="text-center mt-4">
                <a 
                  href={`https://drive.google.com/file/d/${driveFileId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    Google Drive'da Aç
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bionic Text */}
        {(viewMode === 'bionic' || viewMode === 'split') && (
          <Card className={viewMode === 'bionic' ? 'lg:col-span-2' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">Bionic Reading</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="bionic-text prose prose-lg max-w-none p-6 bg-background rounded-lg border min-h-[600px] overflow-y-auto"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{
                  __html: transformTextToBionic(sampleText, settings).replace(/\n/g, '<br>')
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .bionic-text {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #374151;
        }
        
        .bionic-text .bionic-bold {
          font-weight: 700;
          color: #111827;
        }
        
        .dark .bionic-text {
          color: #d1d5db;
        }
        
        .dark .bionic-text .bionic-bold {
          color: #f9fafb;
        }
        
        .bionic-text p {
          margin-bottom: 1.5em;
        }
        
        .bionic-text br {
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  )
}

// Kitaba özel text generator
function getBookSpecificText(title: string): string {
  const lowerTitle = title.toLowerCase()
  
  if (lowerTitle.includes('monte cristo') || lowerTitle.includes('dumas')) {
    return `Monte Cristo Kontu - Alexandre Dumas

Edmond Dantès, Marseille'de genç bir denizci olarak yaşıyordu. Sevgilisi Mercédès ile evlenmeyi planlıyordu. Ancak kıskançlık ve hırs, onun hayatını alt üst etti.

Danglars, Fernand ve Villefort'un komplosuna kurban gitti. Château d'If kalesine hapsedildi. Orada on dört yıl geçirdi. Bu yıllar boyunca hem fiziksel hem de zihinsel olarak güçlendi.

Abbé Faria ile tanışması hayatını değiştirdi. Yaşlı rahip ona eğitim verdi ve Monte Cristo adasındaki hazineyi gösterdi. Kaçışından sonra Monte Cristo Kontu kimliğini aldı.

Paris'e döndüğünde intikam planını uygulamaya başladı. Her düşmanını tek tek buldu ve onlara hak ettikleri cezayı verdi. Ancak intikam yolunda masum insanlar da zarar gördü.

Sonunda affetmeyi öğrendi. Gerçek mutluluğun intikamda değil, sevgide olduğunu anladı. Haydée ile birlikte yeni bir hayata yelken açtı.

Bu hikaye, intikam, adalet ve bağışlamanın gücü hakkında derin dersler verir. İnsan doğasının karmaşıklığını ve değişim gücünü gösterir.`
  }
  
  if (lowerTitle.includes('küçük prens') || lowerTitle.includes('antoine') || lowerTitle.includes('saint')) {
    return `Küçük Prens - Antoine de Saint-Exupéry

Pilot olan anlatıcı, Sahara Çölü'nde düşen uçağını tamir etmeye çalışırken küçük prensle karşılaşır. Bu karşılaşma, onun hayata bakış açısını tamamen değiştirir.

Küçük prens, B-612 adlı küçük bir gezegenden gelir. Orada tek başına yaşar ve gezegenini baobab ağaçlarından korur. Bir gül ile arkadaşlık kurar. Bu gül, onun için çok özeldir.

Gezegenleri dolaşmaya karar verir. Her gezegende farklı bir yetişkinle karşılaşır. Kral, kibirli adam, içki içen, işadamı, lambacı ve coğrafyacı. Her karakter, yetişkin dünyasının farklı bir yanını temsil eder.

Dünya'ya geldiğinde bir tilki ile arkadaşlık kurar. Tilki ona dostluğun anlamını öğretir. "Ehlileştirmek" kelimesinin önemini kavrar. Gülünün aslında ne kadar özel olduğunu anlar.

Yılan ona yardım eder. Küçük prens, bedenini geride bırakarak ruhunu gezegenine gönderir. Bu hikaye, çocukluğun saflığını ve sevginin gücünü anlatır.`
  }
  
  if (lowerTitle.includes('stefan zweig') || lowerTitle.includes('zweig')) {
    return `Stefan Zweig Eserleri

Stefan Zweig, 20. yüzyılın en önemli yazarlarından biridir. Avusturyalı bu yazar, insan psikolojisini derinlemesine inceleyen eserler yazmıştır.

Zweig'in hikayelerinde, genellikle aşk, tutku ve kaderin gücü gibi temalar işlenir. Karakterleri, yaşamın beklenmedik dönüşleri karşısında nasıl tepki verdiklerini gösterir.

"Bilinmeyen Kadının Mektubu" onun en ünlü eserlerinden biridir. Bu hikaye, karşılıksız aşkın trajik öyküsünü anlatır. Genç bir kadın, ünlü bir yazara olan aşkını yıllarca gizli tutar.

Yazarın üslubu, okuyucuyu hikayenin içine çeken bir akıcılığa sahiptir. Her cümle, dikkatli bir şekilde seçilmiş kelimelerle örülmüştür.

"Satranç" adlı eseri, Nazi döneminin psikolojik etkilerini ele alır. İnsan zihninin dayanıklılığını ve kırılganlığını gösterir.`
  }
  
  if (lowerTitle.includes('savaş sanatı') || lowerTitle.includes('sun tzu')) {
    return `Savaş Sanatı - Sun Tzu

Sun Tzu tarafından yazılmış antik Çin'in en önemli stratejik metinlerinden biridir. Bu eser, sadece askeri stratejiler değil, yaşamın her alanında uygulanabilecek bilgiler içerir.

Sun Tzu'ya göre, en iyi savaş hiç savaşmadan kazanılan savaştır. Bu felsefe, çatışmadan kaçınmanın ve diplomasinin önemini vurgular.

Kitapta yer alan stratejiler, iş dünyasından kişisel ilişkilere kadar geniş bir yelpazede kullanılabilir. Rakibini tanımak, kendi güçlerini bilmek ve zamanlamayı doğru yapmak temel prensiplerdir.

"Kendini bil, düşmanını bil; yüz savaş yapsan yüz kez kazanırsın." Bu ünlü söz, stratejik düşüncenin temelini oluşturur.`
  }
  
  // Default text
  return `Bu kitabın Bionic Reading versiyonu için hazırlanmış örnek metindir. Gerçek PDF içeriği yan tarafta görüntülenmektedir.

Bionic Reading teknolojisi, kelimelerin belirli kısımlarını vurgulayarak okuma deneyiminizi geliştirir. Bu yöntem, gözlerinizin metinde daha hızlı hareket etmesini sağlar.

Sol tarafta orijinal PDF'i görüntüleyebilir, sağ tarafta ise Bionic Reading formatında optimize edilmiş metni okuyabilirsiniz.

Ayarlar panelinden vurgulama gücünü, okuma hızını ve yazı boyutunu kendi tercihinize göre ayarlayabilirsiniz. Her okuyucunun farklı ihtiyaçları vardır.

Bu hibrit yaklaşım, hem orijinal PDF'e erişim hem de gelişmiş okuma deneyimi sunar. İstediğiniz görünüm modunu seçebilirsiniz.`
}