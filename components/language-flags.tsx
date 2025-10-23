"use client"

import { useTranslation } from '@/hooks/useTranslation'

export function LanguageFlags() {
    const { language, changeLanguage } = useTranslation()

    return (
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 border border-border">
            <button
                onClick={() => changeLanguage('tr')}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-md transition-all duration-200 ${language === 'tr'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                title="Türkçe"
            >
                <span className="text-sm">🇹🇷</span>
                <span className="text-xs font-medium">TR</span>
            </button>

            <button
                onClick={() => changeLanguage('en')}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-md transition-all duration-200 ${language === 'en'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                title="English"
            >
                <span className="text-sm">🇬🇧</span>
                <span className="text-xs font-medium">EN</span>
            </button>
        </div>
    )
}