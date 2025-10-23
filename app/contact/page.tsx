"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, MessageCircle } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { LanguageFlags } from "@/components/language-flags"

export default function ContactPage() {
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
          {language === 'tr' ? 'İletişim' : 'Contact Us'}
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 font-fragor">
              {language === 'tr' ? 'Bizimle İletişime Geçin' : 'Get in Touch'}
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 font-fragor">
                    {language === 'tr' ? 'E-posta' : 'Email'}
                  </h3>
                  <p className="text-muted-foreground">muhammetatmaca79@gmail.com</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'tr' 
                      ? '24 saat içinde yanıtlıyoruz' 
                      : 'We respond within 24 hours'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 font-fragor">
                    {language === 'tr' ? 'Geri Bildirim' : 'Feedback'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'tr'
                      ? 'Önerileriniz ve geri bildirimleriniz bizim için çok değerli.'
                      : 'Your suggestions and feedback are very valuable to us.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 font-fragor">
              {language === 'tr' ? 'Mesaj Gönderin' : 'Send Message'}
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'tr' ? 'Ad Soyad' : 'Full Name'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder={language === 'tr' ? 'Adınızı girin' : 'Enter your name'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'tr' ? 'E-posta' : 'Email'}
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder={language === 'tr' ? 'E-posta adresinizi girin' : 'Enter your email'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'tr' ? 'Konu' : 'Subject'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder={language === 'tr' ? 'Mesaj konusu' : 'Message subject'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'tr' ? 'Mesaj' : 'Message'}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder={language === 'tr' ? 'Mesajınızı yazın...' : 'Write your message...'}
                />
              </div>
              
              <Button type="submit" className="w-full">
                {language === 'tr' ? 'Mesaj Gönder' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}