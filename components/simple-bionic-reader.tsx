"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Settings, BookOpen, FileText, Maximize2, Eye } from 'lucide-react'
import { transformTextToBionic, BionicSettings, defaultBionicSettings } from '@/lib/bionic-reading'

interface SimpleBionicReaderProps {
  driveFileId: string
  title: string
}

export function SimpleBionicReader({ driveFileId, title }: SimpleBionicReaderProps) {
  const [settings, setSettings] = useState<BionicSettings>(defaultBionicSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [viewMode, setViewMode] = useState<'pdf' | 'bionic' | 'split'>('pdf')

  const handleFixationChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, fixationStrength: value[0] }))
  }

  const handleSaccadeChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, saccadeStrength: value[0] }))
  }

  const getGoogleDriveEmbedUrl = (fileId: string) => {
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  // Kitaba özel örnek text
  const getBionicText = () => {
    const lowerTitle = title.toLowerCase()
    
    if (lowerTitle.includes('monte cristo') || lowerTitle.includes('dumas')) {
      return `Monte Cristo Kontu - Alexandre Dumas

Edmond Dantès, Marseille'de genç bir denizci olarak yaşıyordu. Sevgilisi Mercédès ile evlenmeyi planlıyordu. Ancak kıskançlık ve hırs, onun hayatını alt üst etti.

Danglars, Fernand ve Villefort'un komplosuna kurban gitti. Château d'If kalesine hapsedildi. Orada on dört yıl geçirdi. Bu yıllar boyunca hem fiziksel hem de zihinsel olarak güçlendi.

Abbé Faria ile tanışması hayatını değiştirdi. Yaşlı rahip ona eğitim verdi ve Monte Cristo adasındaki hazineyi gösterdi. Kaçışından sonra Monte Cristo Kontu kimliğini aldı.

Paris'e döndüğünde intikam planını uygulamaya başladı. Her düşmanını tek tek buldu ve onlara hak ettikleri cezayı verdi. Ancak intikam yolunda masum insanlar da zarar gördü.

Sonunda affetmeyi öğrendi. Gerçek mutluluğun intikamda değil, sevgide olduğunu anladı. Haydée ile birlikte yeni bir hayata yelken açtı.`
    }
    
    if (lowerTitle.includes('küçük prens') || lowerTitle.includes('antoine')) {
      return `Küçük Prens - Antoine de Saint-Exupéry

Pilot olan anlatıcı, Sahara Çölü'nde düşen uçağını tamir etmeye çalışırken küçük prensle karşılaşır. Bu karşılaşma, onun hayata bakış açısını tamamen değiştirir.

Küçük prens, B-612 adlı küçük bir gezegenden gelir. Orada tek başına yaşar ve gezegenini baobab ağaçlarından korur. Bir gül ile arkadaşlık kurar. Bu gül, onun için çok özeldir.

Gezegenleri dolaşmaya karar verir. Her gezegende farklı bir yetişkinle karşılaşır. Kral, kibirli adam, içki içen, işadamı, lambacı ve coğrafyacı. Her karakter, yetişkin dünyasının farklı bir yanını temsil eder.

Dünya'ya geldiğinde bir tilki ile arkadaşlık kurar. Tilki ona dostluğun anlamını öğretir. "Ehlileştirmek" kelimesinin önemini kavrar. Gülünün aslında ne kadar özel olduğunu anlar.

Bu hikaye, çocukluğun saflığını ve sevginin gücünü anlatır. Yetişkin dünyasının karmaşıklığına karşı masumiyetin değerini gösterir.`
    }
    
    if (lowerTitle.includes('stefan zweig') || lowerTitle.includes('zweig')) {
      return `Stefan Zweig Eserleri

Stefan Zweig, 20. yüzyılın en önemli yazarlarından biridir. Avusturyalı bu yazar, insan psikolojisini derinlemesine inceleyen eserler yazmıştır.

"Bilinmeyen Kadının Mektubu" onun en ünlü eserlerinden biridir. Bu hikaye, karşılıksız aşkın trajik öyküsünü anlatır. Genç bir kadın, ünlü bir yazara olan aşkını yıllarca gizli tutar.

"Satranç" adlı eseri, Nazi döneminin psikolojik etkilerini ele alır. İnsan zihninin dayanıklılığını ve kırılganlığını gösterir.

Yazarın üslubu, okuyucuyu hikayenin içine çeken bir akıcılığa sahiptir. Her cümle, dikkatli bir şekilde seçilmiş kelimelerle örülmüştür.

Zweig'in karakterleri genellikle orta sınıf Avrupalılardır. Onların iç dünyalarını, korkularını ve umutlarını ustalıkla betimler.`
    }
    
    return `${title}

Bu kitabın Bionic Reading versiyonu için hazırlanmış örnek metindir. Gerçek PDF içeriği sol tarafta görüntülenmektedir.

Bionic Reading teknolojisi, kelimelerin belirli kısımlarını vurgulayarak okuma deneyiminizi geliştirir. Bu yöntem, gözlerinizin metinde daha hızlı hareket etmesini sağlar.

Araştırmalar gösteriyor ki, bu teknik okuma hızını %20-30 oranında artırabilir. Özellikle uzun metinlerde yorgunluğu azaltır ve anlama kapasitesini geliştirir.

Ayarlar panelinden vurgulama gücünü, okuma hızını ve yazı boyutunu kendi tercihinize göre ayarlayabilirsiniz. Her okuyucunun farklı ihtiyaçları vardır.`
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Font Size */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Yazı Boyutu: {fontSize}px
                </label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={12}
                  max={24}
                  step={2}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Okuma konforunuzu ayarlayın
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Content Area */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* PDF Viewer */}
        {(viewMode === 'pdf' || viewMode === 'split') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PDF Görünümü
              </CardTitle>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Bionic Reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="bionic-text prose prose-lg max-w-none p-6 bg-background rounded-lg border min-h-[600px] overflow-y-auto"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{
                  __html: transformTextToBionic(getBionicText(), settings).replace(/\n/g, '<br>')
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
      `}</style>
    </div>
  )
}