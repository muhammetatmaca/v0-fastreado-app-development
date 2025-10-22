"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Sparkles, Loader2, FileText, Mic, Crown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface AIFeaturesDialogProps {
  pdfId: string
  pdfTitle: string
}

export function AIFeaturesDialog({ pdfId, pdfTitle }: AIFeaturesDialogProps) {
  const { user } = useAuth()
  const isPremium = user?.plan === "premium"

  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState<string>("")
  const [podcast, setPodcast] = useState<string>("")
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingPodcast, setLoadingPodcast] = useState(false)

  const generateSummary = async () => {
    if (!isPremium) return

    setLoadingSummary(true)
    try {
      const mockText = `Bu kitap, alışkanlıkların gücünü ve nasıl değiştirilebileceğini anlatıyor. 
      Küçük değişikliklerin zamanla büyük sonuçlar doğurabileceğini gösteriyor. 
      Yazar, bilimsel araştırmalara dayanarak alışkanlık oluşturma ve değiştirme stratejileri sunuyor.`

      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfText: mockText, pdfTitle }),
      })

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error("[v0] Summary generation failed:", error)
      setSummary("Özet oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoadingSummary(false)
    }
  }

  const generatePodcast = async () => {
    if (!isPremium) return

    setLoadingPodcast(true)
    try {
      const mockText = `Bu kitap, alışkanlıkların gücünü ve nasıl değiştirilebileceğini anlatıyor. 
      Küçük değişikliklerin zamanla büyük sonuçlar doğurabileceğini gösteriyor.`

      const response = await fetch("/api/ai/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfText: mockText, pdfTitle }),
      })

      const data = await response.json()
      setPodcast(data.script)
    } catch (error) {
      console.error("[v0] Podcast generation failed:", error)
      setPodcast("Podcast oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoadingPodcast(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 md:gap-2 bg-transparent text-xs md:text-sm w-full">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">AI Özellikleri</span>
          <span className="sm:hidden">AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Özellikleri
          </DialogTitle>
          <DialogDescription>{pdfTitle} için AI destekli özet ve podcast oluşturun</DialogDescription>
        </DialogHeader>

        {!isPremium ? (
          <Card className="p-8 text-center">
            <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-semibold mb-2">Premium Özellik</h3>
            <p className="text-muted-foreground mb-6">
              AI özet ve podcast özellikleri Premium abonelik gerektirir. Premium'a geçerek sınırsız PDF ve tüm AI
              özelliklerine erişin.
            </p>
            <Link href="/pricing">
              <Button size="lg" className="gap-2">
                <Crown className="w-4 h-4" />
                Premium'a Geç
              </Button>
            </Link>
          </Card>
        ) : (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary" className="gap-2">
                <FileText className="w-4 h-4" />
                Özet
              </TabsTrigger>
              <TabsTrigger value="podcast" className="gap-2">
                <Mic className="w-4 h-4" />
                Podcast
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card className="p-6">
                {!summary ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">AI Özet Oluştur</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      PDF içeriğinizin kapsamlı bir özetini oluşturun
                    </p>
                    <Button onClick={generateSummary} disabled={loadingSummary}>
                      {loadingSummary ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Oluşturuluyor...
                        </>
                      ) : (
                        "Özet Oluştur"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="prose prose-sm max-w-none mb-4">
                      <div className="whitespace-pre-wrap text-foreground leading-relaxed">{summary}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={generateSummary} disabled={loadingSummary}>
                      Yeniden Oluştur
                    </Button>
                  </div>
                )}
              </Card>
              <p className="text-xs text-muted-foreground text-center">
                Premium özellik • Gemini AI ile desteklenmektedir
              </p>
            </TabsContent>

            <TabsContent value="podcast" className="space-y-4">
              <Card className="p-6">
                {!podcast ? (
                  <div className="text-center py-8">
                    <Mic className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Podcast Senaryosu Oluştur</h3>
                    <p className="text-sm text-muted-foreground mb-4">PDF içeriğinizi podcast formatına dönüştürün</p>
                    <Button onClick={generatePodcast} disabled={loadingPodcast}>
                      {loadingPodcast ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Oluşturuluyor...
                        </>
                      ) : (
                        "Podcast Oluştur"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="prose prose-sm max-w-none mb-4">
                      <div className="whitespace-pre-wrap text-foreground leading-relaxed">{podcast}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={generatePodcast} disabled={loadingPodcast}>
                      Yeniden Oluştur
                    </Button>
                  </div>
                )}
              </Card>
              <p className="text-xs text-muted-foreground text-center">
                Premium özellik • Gemini AI ile desteklenmektedir
              </p>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
