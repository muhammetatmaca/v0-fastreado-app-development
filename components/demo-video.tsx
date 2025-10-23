"use client"

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Play, X } from 'lucide-react'

export function DemoVideo() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const { language, t } = useTranslation()
  const { user } = useAuth()

  // Direkt Cloudinary video URL'leri
  const directVideoUrls = {
    tr: "https://res.cloudinary.com/dlotlb4nz/video/upload/v1761145200/Ads%C4%B1z_video_Clipchamp_ile_yap%C4%B1ld%C4%B1_lzwijp.mp4",
    en: "https://res.cloudinary.com/dlotlb4nz/video/upload/v1761145191/Ads%C4%B1z_video_Clipchamp_ile_yap%C4%B1ld%C4%B1_1_jmyz7i.mp4"
  }

  const currentDirectUrl = directVideoUrls[language as keyof typeof directVideoUrls] || directVideoUrls.en

  // Siteyi ilk açınca otomatik video aç (sadece giriş yapmamış kullanıcılar için)
  useEffect(() => {
    const hasSeenVideo = localStorage.getItem('hasSeenDemoVideo')

    // Sadece giriş yapmamış kullanıcılara otomatik göster
    if (!hasSeenVideo && !user) {
      const timer = setTimeout(() => {
        setIsVideoOpen(true)
        localStorage.setItem('hasSeenDemoVideo', 'true')
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [user])

  // Demo butonuna tıklandığında video aç
  useEffect(() => {
    const handleDemoClick = (e: Event) => {
      e.preventDefault()
      setIsVideoOpen(true)
    }

    // #demo linklerine tıklandığında video aç
    const demoLinks = document.querySelectorAll('a[href="#demo"]')
    demoLinks.forEach(link => {
      link.addEventListener('click', handleDemoClick)
    })

    return () => {
      demoLinks.forEach(link => {
        link.removeEventListener('click', handleDemoClick)
      })
    }
  }, [])

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoOpen) {
        setIsVideoOpen(false)
      }
    }

    if (isVideoOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Scroll'u engelle
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset' // Scroll'u geri aç
    }
  }, [isVideoOpen])

  return (
    <>
      {/* Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Cloudinary Video Player - Direkt video */}
            <video
              src={currentDirectUrl}
              controls
              autoPlay
              muted
              className="w-full h-auto max-h-[80vh] rounded-lg"
              style={{ aspectRatio: '16/9' }}
              onError={() => {
                // Video yükleme hatası
              }}
            >
              {t("video.video_error")}
            </video>
          </div>
        </div>
      )}
    </>
  )
}