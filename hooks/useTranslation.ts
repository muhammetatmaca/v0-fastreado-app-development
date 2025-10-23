"use client"

import { useState, useEffect } from 'react'
import { Language, getCurrentLanguage, setCurrentLanguage, t as translate, initI18n } from '@/lib/i18n'

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('tr')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      try {
        const detectedLang = await initI18n()
        setLanguage(detectedLang)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        setLanguage('tr')
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  const changeLanguage = (newLang: Language) => {
    setCurrentLanguage(newLang)
    setLanguage(newLang)
    
    // Reload page to apply new language
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const t = (key: string, params?: { [key: string]: string | number }): string => {
    return translate(key, params)
  }

  return {
    language,
    changeLanguage,
    t,
    isLoading
  }
}