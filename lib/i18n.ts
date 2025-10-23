// Simple i18n system without external dependencies

export type Language = 'tr' | 'en'

interface Translations {
  [key: string]: any
}

let currentLanguage: Language = 'tr'
let translations: { [lang in Language]: Translations } = {
  tr: {},
  en: {}
}

// Load translations
export async function loadTranslations() {
  try {
    const [trResponse, enResponse] = await Promise.all([
      fetch('/locales/tr.json'),
      fetch('/locales/en.json')
    ])
    
    translations.tr = await trResponse.json()
    translations.en = await enResponse.json()
  } catch (error) {
    console.error('Failed to load translations:', error)
  }
}

// Get language from cookie
export function getLanguageFromCookie(): Language {
  if (typeof window === 'undefined') return 'tr'
  
  const cookies = document.cookie.split(';')
  const langCookie = cookies.find(cookie => cookie.trim().startsWith('lang='))
  
  if (langCookie) {
    const lang = langCookie.split('=')[1].trim() as Language
    return lang === 'en' ? 'en' : 'tr'
  }
  
  return 'tr'
}

// Set language cookie
export function setLanguageCookie(lang: Language) {
  if (typeof window === 'undefined') return
  
  document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
  currentLanguage = lang
}

// Auto-detect language on first visit
export async function autoDetectLanguage() {
  if (typeof window === 'undefined') return
  
  // Check if user already has a language preference
  const existingLang = getLanguageFromCookie()
  if (existingLang) {
    currentLanguage = existingLang
    return existingLang
  }
  
  try {
    // Call our IP detection API
    const response = await fetch('/api/detect-language')
    const data = await response.json()
    
    const detectedLang = data.language as Language
    setLanguageCookie(detectedLang)
    currentLanguage = detectedLang
    
    return detectedLang
  } catch (error) {
    console.error('Language detection failed:', error)
    // Fallback to Turkish
    setLanguageCookie('tr')
    currentLanguage = 'tr'
    return 'tr'
  }
}

// Get current language
export function getCurrentLanguage(): Language {
  return currentLanguage
}

// Set current language
export function setCurrentLanguage(lang: Language) {
  currentLanguage = lang
  setLanguageCookie(lang)
}

// Translate function
export function t(key: string, params?: { [key: string]: string | number }): string {
  const keys = key.split('.')
  let value: any = translations[currentLanguage]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  if (typeof value !== 'string') {
    return key // Return key if translation not found
  }
  
  // Replace parameters
  if (params) {
    Object.keys(params).forEach(param => {
      value = value.replace(`{${param}}`, String(params[param]))
    })
  }
  
  return value
}

// Initialize i18n system
export async function initI18n() {
  await loadTranslations()
  const detectedLang = await autoDetectLanguage()
  currentLanguage = detectedLang
  return detectedLang
}