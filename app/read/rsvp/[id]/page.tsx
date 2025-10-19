"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Settings, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock text data
const SAMPLE_TEXT = `Hızlı okuma, modern dünyanın en değerli becerilerinden biridir. Bilgi çağında yaşarken, daha fazla içeriği daha kısa sürede tüketebilmek büyük bir avantaj sağlar. RSVP yöntemi, kelimeleri tek tek göstererek gözlerinizin sayfada gezinme ihtiyacını ortadan kaldırır. Bu sayede okuma hızınız önemli ölçüde artar. Araştırmalar, bu yöntemle ortalama okuma hızının iki katına çıkabileceğini gösteriyor. Pratik yaptıkça daha da hızlanacaksınız.`

export default function RSVPReaderPage() {
  const [words, setWords] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wpm, setWpm] = useState(300)

  useEffect(() => {
    // Split text into words
    const wordArray = SAMPLE_TEXT.split(/\s+/)
    setWords(wordArray)
  }, [])

  useEffect(() => {
    if (!isPlaying || currentIndex >= words.length) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= words.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 60000 / wpm)

    return () => clearInterval(interval)
  }, [isPlaying, wpm, currentIndex, words.length])

  const currentWord = words[currentIndex] || ""
  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0

  const getORP = (word: string) => {
    const length = word.length
    if (length === 1) return 0
    if (length === 2) return 0
    if (length === 3) return 1
    // For longer words, ORP is roughly 1/3 from the start
    return Math.floor(length / 3)
  }

  const orpIndex = getORP(currentWord)
  const beforeORP = currentWord.slice(0, orpIndex)
  const orpLetter = currentWord[orpIndex] || ""
  const afterORP = currentWord.slice(orpIndex + 1)

  const getDynamicFontSize = (wordLength: number) => {
    // Base sizes for different breakpoints
    if (wordLength <= 8) {
      return "text-3xl md:text-5xl lg:text-6xl" // Normal size
    } else if (wordLength <= 12) {
      return "text-2xl md:text-4xl lg:text-5xl" // Slightly smaller
    } else if (wordLength <= 16) {
      return "text-xl md:text-3xl lg:text-4xl" // Smaller
    } else {
      return "text-lg md:text-2xl lg:text-3xl" // Very small for very long words
    }
  }

  const fontSizeClass = getDynamicFontSize(currentWord.length)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/library">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Kütüphane</span>
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">RSVP Okuyucu</div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Reading Area */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-4xl">
          <Card className="p-8 md:p-16 mb-8 min-h-[250px] md:min-h-[300px] flex items-center justify-center bg-card/50">
            <div className="text-center w-full overflow-hidden">
              <div className="font-mono flex items-center justify-center gap-0">
                <span className={`${fontSizeClass} font-bold text-foreground text-right`} style={{ minWidth: "0" }}>
                  {beforeORP}
                </span>
                <span className={`${fontSizeClass} text-red-500 font-extrabold`}>{orpLetter}</span>
                <span className={`${fontSizeClass} font-bold text-foreground text-left`} style={{ minWidth: "0" }}>
                  {afterORP}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-4">
                {currentIndex + 1} / {words.length} kelime
              </div>
            </div>
          </Card>

          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4 sm:space-y-6">
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 bg-transparent"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 10))}
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              <Button
                size="lg"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-1" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 sm:h-12 sm:w-12 bg-transparent"
                onClick={() => setCurrentIndex(Math.min(words.length - 1, currentIndex + 10))}
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            {/* Speed Control */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-medium">Okuma Hızı</span>
                <span className="text-xl sm:text-2xl font-bold text-primary">{wpm} WPM</span>
              </div>
              <Slider
                value={[wpm]}
                onValueChange={(value) => setWpm(value[0])}
                min={100}
                max={1000}
                step={50}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Yavaş</span>
                <span>Hızlı</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
