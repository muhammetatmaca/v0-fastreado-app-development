"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"

export default function AboutPage() {
  const { t, language } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'tr' ? 'Ana Sayfa' : 'Home'}
              </Link>
            </Button>
            <img src="/fastreado-logo.png" alt="Fastreado" className="h-8 w-auto logo-img" />
          </div>
          <LanguageFlags />
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 font-fragor">
          {language === 'tr' ? 'Hakkımızda' : 'About Us'}
        </h1>

        <div className="prose prose-lg max-w-none">
          {language === 'tr' ? (
            <>
              <p className="text-lg text-muted-foreground mb-6">
                Fastreado, hızlı okuma teknolojileri ile okuma deneyiminizi geliştiren modern bir platformdur.
              </p>

              <h2 className="text-2xl font-semibold mb-4 font-fragor">Misyonumuz</h2>
              <p className="text-muted-foreground mb-6">
                İnsanların bilgiyi daha hızlı ve etkili bir şekilde öğrenmelerine yardımcı olmak. 
                RSVP ve Biyonik Okuma teknolojileri ile okuma hızınızı artırırken, AI destekli 
                özetleme ve podcast özellikleri ile içeriği daha kolay sindirmenizi sağlıyoruz.
              </p>

              <h2 className="text-2xl font-semibold mb-4 font-fragor">Teknolojilerimiz</h2>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li><strong>RSVP (Rapid Serial Visual Presentation):</strong> Kelime kelime hızlı okuma</li>
                <li><strong>Biyonik Okuma:</strong> İlk ve son harfleri vurgulayarak doğal okuma hızını artırma</li>
                <li><strong>AI Özet:</strong> Gemini AI ile otomatik içerik özetleme</li>
                <li><strong>Podcast Dönüştürme:</strong> Metinleri sesli içeriğe çevirme</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 font-fragor">Vizyonumuz</h2>
              <p className="text-muted-foreground">
                Gelecekte, öğrenme ve bilgi edinme süreçlerini daha verimli hale getiren 
                teknolojilerin öncüsü olmak. Herkesin bilgiye daha hızlı erişebileceği 
                bir dünya yaratmak istiyoruz.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg text-muted-foreground mb-6">
                Fastreado is a modern platform that enhances your reading experience with speed reading technologies.
              </p>

              <h2 className="text-2xl font-semibold mb-4 font-fragor">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                To help people learn information faster and more effectively. We increase your reading speed 
                with RSVP and Bionic Reading technologies, while making content easier to digest with 
                AI-powered summarization and podcast features.
              </p>

              <h2 className="text-2xl font-semibold mb-4 font-fragor">Our Technologies</h2>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                <li><strong>RSVP (Rapid Serial Visual Presentation):</strong> Word-by-word speed reading</li>
                <li><strong>Bionic Reading:</strong> Enhancing natural reading speed by highlighting first and last letters</li>
                <li><strong>AI Summary:</strong> Automatic content summarization with Gemini AI</li>
                <li><strong>Podcast Conversion:</strong> Converting text to audio content</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 font-fragor">Our Vision</h2>
              <p className="text-muted-foreground">
                To be a pioneer of technologies that make learning and knowledge acquisition processes 
                more efficient in the future. We want to create a world where everyone can access 
                information faster.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}