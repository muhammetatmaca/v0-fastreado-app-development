"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, ChevronRight, Settings, ArrowLeft, Type } from "lucide-react"
import Link from "next/link"
import { getBookContent, getBookInfo } from "@/lib/mock-books"

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

export default function BionicReaderPage() {
  const params = useParams()
  const bookId = params.id as string
  const [currentPage, setCurrentPage] = useState(0)
  const [fontSize, setFontSize] = useState(18)
  const [bookInfo, setBookInfo] = useState<any>(null)
  const [pageContent, setPageContent] = useState("")

  useEffect(() => {
    const info = getBookInfo(bookId)
    setBookInfo(info)
    
    if (info) {
      const content = getBookContent(bookId, currentPage)
      setPageContent(content)
    }
  }, [bookId, currentPage])

  const totalPages = bookInfo?.content.length || 1
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
            <div className="text-sm text-muted-foreground">
              {bookInfo ? `${bookInfo.title} - ${bookInfo.author}` : 'Bionic Okuyucu'}
            </div>
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
              {pageContent && makeBionic(pageContent)}
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
