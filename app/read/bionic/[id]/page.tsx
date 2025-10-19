"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, ChevronRight, Settings, ArrowLeft, Type } from "lucide-react"
import Link from "next/link"

// Mock text data
const SAMPLE_PAGES = [
  `Hızlı okuma, modern dünyanın en değerli becerilerinden biridir. Bilgi çağında yaşarken, daha fazla içeriği daha kısa sürede tüketebilmek büyük bir avantaj sağlar.

Bionic okuma yöntemi, kelimelerin ilk ve son harflerini kalınlaştırarak gözlerinizin metni daha hızlı taramasını sağlar. Bu teknik, beynin kelime tanıma sürecini hızlandırır.

Araştırmalar gösteriyor ki, insanlar kelimeleri harf harf değil, bütün olarak algılar. Kalınlaştırılmış harfler, bu algılamayı kolaylaştırır ve okuma hızını artırır.`,

  `Pratik yaptıkça bu yöntemle okuma hızınız önemli ölçüde artacaktır. İlk başta alışık olmadığınız için yavaş gelebilir, ancak zamanla doğal hale gelir.

Düzenli egzersiz, hızlı okuma becerinizi geliştirmenin anahtarıdır. Her gün en az 15-20 dakika pratik yapmanız önerilir.

Unutmayın, hız kadar anlama da önemlidir. Hızlı okurken içeriği kavramaya da dikkat edin.`,
]

function makeBionic(text: string): JSX.Element[] {
  return text.split("\n\n").map((paragraph, pIndex) => (
    <p key={pIndex} className="mb-6 leading-relaxed">
      {paragraph.split(" ").map((word, wIndex) => {
        if (word.length <= 2) {
          return (
            <span key={wIndex}>
              <span className="font-bold">{word}</span>{" "}
            </span>
          )
        }

        const boldCount = Math.ceil(word.length / 2)
        const boldPart = word.slice(0, boldCount)
        const normalPart = word.slice(boldCount)

        return (
          <span key={wIndex}>
            <span className="font-bold">{boldPart}</span>
            <span className="font-normal">{normalPart}</span>{" "}
          </span>
        )
      })}
    </p>
  ))
}

export default function BionicReaderPage({ params }: { params: any }) {
  const { id } = params
  const [currentPage, setCurrentPage] = useState(0)
  const [fontSize, setFontSize] = useState(18)

  const totalPages = SAMPLE_PAGES.length
  const progress = ((currentPage + 1) / totalPages) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/library">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kütüphane
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">Bionic Okuyucu</div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Reading Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {/* Page Content */}
          <Card className="p-8 md:p-12 mb-6 min-h-[500px] bg-card/50">
            <div className="text-foreground" style={{ fontSize: `${fontSize}px` }}>
              {makeBionic(SAMPLE_PAGES[currentPage])}
            </div>
          </Card>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span>
                Sayfa {currentPage + 1} / {totalPages}
              </span>
              <span>%{Math.round(progress)} tamamlandı</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="flex-1"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Önceki
              </Button>

              <Button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="flex-1"
              >
                Sonraki
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Font Size Control */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Yazı Boyutu
                </span>
                <span className="text-lg font-bold text-primary">{fontSize}px</span>
              </div>
              <Slider
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                min={14}
                max={32}
                step={2}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Küçük</span>
                <span>Büyük</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
