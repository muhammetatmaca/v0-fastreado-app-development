"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle, Book, Zap, Sparkles } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"

export default function SupportPage() {
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
          {language === 'tr' ? 'Destek' : 'Support'}
        </h1>

        {/* Help Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 font-fragor">
              {language === 'tr' ? 'Başlangıç Rehberi' : 'Getting Started'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'tr'
                ? 'Fastreado\'yu kullanmaya başlamak için adım adım rehber.'
                : 'Step-by-step guide to get started with Fastreado.'
              }
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {language === 'tr' ? 'Hesap oluşturma' : 'Account creation'}</li>
              <li>• {language === 'tr' ? 'PDF yükleme' : 'PDF upload'}</li>
              <li>• {language === 'tr' ? 'Okuma modları' : 'Reading modes'}</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 font-fragor">
              {language === 'tr' ? 'RSVP Okuma' : 'RSVP Reading'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'tr'
                ? 'Hızlı okuma teknolojisini nasıl kullanacağınızı öğrenin.'
                : 'Learn how to use speed reading technology.'
              }
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {language === 'tr' ? 'Hız ayarlama' : 'Speed adjustment'}</li>
              <li>• {language === 'tr' ? 'Odaklanma teknikleri' : 'Focus techniques'}</li>
              <li>• {language === 'tr' ? 'İlerleme takibi' : 'Progress tracking'}</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 font-fragor">
              {language === 'tr' ? 'Biyonik Okuma' : 'Bionic Reading'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'tr'
                ? 'Doğal okuma hızınızı artıran teknolojiyi keşfedin.'
                : 'Discover technology that increases your natural reading speed.'
              }
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {language === 'tr' ? 'Vurgulama sistemi' : 'Highlighting system'}</li>
              <li>• {language === 'tr' ? 'Göz hareketleri' : 'Eye movements'}</li>
              <li>• {language === 'tr' ? 'Anlama oranı' : 'Comprehension rate'}</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 font-fragor">
              {language === 'tr' ? 'AI Özellikleri' : 'AI Features'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'tr'
                ? 'Yapay zeka destekli özet ve podcast özelliklerini kullanın.'
                : 'Use AI-powered summary and podcast features.'
              }
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {language === 'tr' ? 'Otomatik özet' : 'Auto summary'}</li>
              <li>• {language === 'tr' ? 'Podcast oluşturma' : 'Podcast creation'}</li>
              <li>• {language === 'tr' ? 'Anahtar kelimeler' : 'Keywords'}</li>
            </ul>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-3 font-fragor">
            {language === 'tr' ? 'Hala Yardıma İhtiyacınız Var mı?' : 'Still Need Help?'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {language === 'tr'
              ? 'Sorularınız için bizimle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız.'
              : 'Contact us for your questions. We\'d be happy to help you.'
            }
          </p>
          <Button asChild>
            <Link href="/contact">
              {language === 'tr' ? 'İletişime Geç' : 'Contact Us'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}