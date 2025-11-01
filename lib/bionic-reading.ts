// Bionic Reading text transformation utilities

export interface BionicSettings {
  fixationStrength: number // 1-5 arası, ne kadar kalın olacağı
  saccadeStrength: number  // 1-5 arası, ne kadar kelime vurgulanacağı
}

export const defaultBionicSettings: BionicSettings = {
  fixationStrength: 3,
  saccadeStrength: 3
}

/**
 * Tek bir kelimeyi Bionic Reading formatına çevirir
 */
export function transformWordToBionic(word: string, settings: BionicSettings = defaultBionicSettings): string {
  // Boş string kontrolü
  if (!word || word.trim().length === 0) return word
  
  // Sadece harf içeren kısmı al (noktalama işaretlerini ayır)
  const match = word.match(/^(\W*)(.*?)(\W*)$/)
  if (!match) return word
  
  const [, prefix, cleanWord, suffix] = match
  
  // Çok kısa kelimeler için
  if (cleanWord.length <= 1) {
    return word
  }
  
  // Fixation point hesapla (kelimenin kaçta kaçı kalın olacak)
  let fixationLength: number
  
  if (cleanWord.length <= 3) {
    // Kısa kelimeler tamamen kalın
    fixationLength = cleanWord.length
  } else if (cleanWord.length <= 6) {
    // Orta kelimeler yarısı kalın
    fixationLength = Math.ceil(cleanWord.length / 2)
  } else {
    // Uzun kelimeler için saccade strength'e göre
    const ratio = 0.3 + (settings.saccadeStrength * 0.1) // %30-%80 arası
    fixationLength = Math.ceil(cleanWord.length * ratio)
  }
  
  // Minimum 1, maksimum kelime uzunluğu-1
  fixationLength = Math.max(1, Math.min(fixationLength, cleanWord.length - 1))
  
  const boldPart = cleanWord.substring(0, fixationLength)
  const normalPart = cleanWord.substring(fixationLength)
  
  return `${prefix}<strong class="bionic-bold">${boldPart}</strong>${normalPart}${suffix}`
}

/**
 * Bir paragrafı Bionic Reading formatına çevirir
 */
export function transformParagraphToBionic(paragraph: string, settings: BionicSettings = defaultBionicSettings): string {
  if (!paragraph || paragraph.trim().length === 0) return paragraph
  
  // Kelimeleri ayır (boşlukları koru)
  const words = paragraph.split(/(\s+)/)
  
  return words.map(word => {
    // Boşluk ise olduğu gibi bırak
    if (/^\s+$/.test(word)) return word
    
    // Kelimeyi transform et
    return transformWordToBionic(word, settings)
  }).join('')
}

/**
 * Tüm metni Bionic Reading formatına çevirir
 */
export function transformTextToBionic(text: string, settings: BionicSettings = defaultBionicSettings): string {
  if (!text || text.trim().length === 0) return text
  
  // Paragrafları ayır
  const paragraphs = text.split(/\n\n+/)
  
  return paragraphs.map(paragraph => {
    // Her paragrafı transform et
    return transformParagraphToBionic(paragraph, settings)
  }).join('\n\n')
}

/**
 * HTML içeriğini Bionic Reading formatına çevirir
 */
export function transformHtmlToBionic(html: string, settings: BionicSettings = defaultBionicSettings): string {
  if (!html || html.trim().length === 0) return html
  
  // Basit HTML tag'lerini koru, sadece text içeriğini transform et
  return html.replace(/>([^<]+)</g, (match, textContent) => {
    const transformedText = transformTextToBionic(textContent, settings)
    return `>${transformedText}<`
  })
}

/**
 * PDF text extraction için özel transform
 */
export function transformPdfTextToBionic(text: string, settings: BionicSettings = defaultBionicSettings): string {
  if (!text || text.trim().length === 0) return text
  
  // PDF'den gelen text genelde satır satır gelir
  const lines = text.split('\n')
  
  return lines.map(line => {
    // Boş satırları koru
    if (line.trim().length === 0) return line
    
    // Her satırı transform et
    return transformParagraphToBionic(line, settings)
  }).join('\n')
}

/**
 * Bionic Reading ayarlarını validate et
 */
export function validateBionicSettings(settings: Partial<BionicSettings>): BionicSettings {
  return {
    fixationStrength: Math.max(1, Math.min(5, settings.fixationStrength || 3)),
    saccadeStrength: Math.max(1, Math.min(5, settings.saccadeStrength || 3))
  }
}