import React from 'react'
import { BookOpen } from 'lucide-react'

interface BookCoverProps {
  title: string
  language?: 'tr' | 'en'
  isUserUploaded?: boolean
  className?: string
}

export function BookCover({ title, language, isUserUploaded, className = '' }: BookCoverProps) {
  // Kitap başlığına göre renk paleti seç
  const getGradientColors = (title: string) => {
    const colors = [
      // Mavi tonları
      ['from-blue-600', 'via-blue-700', 'to-indigo-800'],
      ['from-indigo-600', 'via-purple-600', 'to-purple-800'],
      
      // Yeşil tonları  
      ['from-emerald-600', 'via-teal-600', 'to-cyan-700'],
      ['from-green-600', 'via-emerald-600', 'to-teal-700'],
      
      // Kırmızı/Turuncu tonları
      ['from-red-600', 'via-rose-600', 'to-pink-700'],
      ['from-orange-600', 'via-red-600', 'to-rose-700'],
      
      // Mor tonları
      ['from-violet-600', 'via-purple-600', 'to-indigo-700'],
      ['from-purple-600', 'via-violet-600', 'to-purple-800'],
      
      // Koyu tonlar
      ['from-slate-700', 'via-gray-800', 'to-slate-900'],
      ['from-gray-700', 'via-slate-800', 'to-gray-900'],
    ]
    
    // Başlığın hash değerine göre renk seç
    let hash = 0
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  const [fromColor, viaColor, toColor] = getGradientColors(title)
  
  // Başlığı kısalt
  const getDisplayTitle = (title: string) => {
    // Uzun başlıkları kısalt
    if (title.length > 60) {
      return title.substring(0, 57) + '...'
    }
    return title
  }

  // Yazar adını çıkar (eğer varsa)
  const extractAuthorAndTitle = (fullTitle: string) => {
    // "Yazar - Kitap" formatını kontrol et
    const parts = fullTitle.split(' - ')
    if (parts.length >= 2) {
      return {
        author: parts[0].trim(),
        title: parts.slice(1).join(' - ').trim()
      }
    }
    
    // "Kitap -- Yazar" formatını kontrol et  
    const parts2 = fullTitle.split(' -- ')
    if (parts2.length >= 2) {
      return {
        title: parts2[0].trim(),
        author: parts2[1].trim()
      }
    }
    
    return {
      title: fullTitle,
      author: null
    }
  }

  const { title: bookTitle, author } = extractAuthorAndTitle(title)
  const displayTitle = getDisplayTitle(bookTitle)

  return (
    <div className={`relative aspect-[2/3] bg-gradient-to-br ${fromColor} ${viaColor} ${toColor} overflow-hidden rounded-lg shadow-lg ${className}`}>
      {/* Arka plan deseni */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/30 rounded-full"></div>
        <div className="absolute bottom-8 right-6 w-12 h-12 border border-white/20 rotate-45"></div>
        <div className="absolute top-1/2 right-4 w-8 h-8 border border-white/20 rounded-full"></div>
      </div>
      
      {/* İçerik */}
      <div className="relative h-full flex flex-col justify-between p-4 text-white">
        {/* Üst kısım - Dil etiketi */}
        <div className="flex justify-between items-start">
          {language && (
            <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              {language === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
            </div>
          )}
          {isUserUploaded && (
            <div className="bg-blue-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              Benim
            </div>
          )}
        </div>

        {/* Orta kısım - Kitap ikonu */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-2">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
          </div>
          <div className="w-16 h-0.5 bg-white/40 rounded-full"></div>
        </div>

        {/* Alt kısım - Dekoratif çizgi */}
        <div className="flex justify-center">
          <div className="w-12 h-0.5 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Işık efekti */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
    </div>
  )
}