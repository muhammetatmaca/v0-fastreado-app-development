"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Settings, BookOpen, Eye, Minus, Plus } from 'lucide-react'
import { transformTextToBionic, BionicSettings, defaultBionicSettings } from '@/lib/bionic-reading'

interface BionicReaderProps {
  text: string
  title?: string
  onSettingsChange?: (settings: BionicSettings) => void
}

export function BionicReader({ text, title, onSettingsChange }: BionicReaderProps) {
  const [settings, setSettings] = useState<BionicSettings>(defaultBionicSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [transformedText, setTransformedText] = useState('')

  // Text'i transform et
  useEffect(() => {
    if (text) {
      const transformed = transformTextToBionic(text, settings)
      setTransformedText(transformed)
    }
  }, [text, settings])

  // Settings değiştiğinde callback çağır
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange(settings)
    }
  }, [settings, onSettingsChange])

  const handleFixationChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, fixationStrength: value[0] }))
  }

  const handleSaccadeChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, saccadeStrength: value[0] }))
  }

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Kontrol Paneli */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Bionic Reading
              {title && <span className="text-sm font-normal text-muted-foreground">- {title}</span>}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Ayarlar
            </Button>
          </div>
        </CardHeader>

        {showSettings && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fixation Strength */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Vurgulama Gücü: {settings.fixationStrength}
                </label>
                <Slider
                  value={[settings.fixationStrength]}
                  onValueChange={handleFixationChange}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Kelimelerin ne kadarının kalın olacağını belirler
                </p>
              </div>

              {/* Saccade Strength */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Okuma Hızı: {settings.saccadeStrength}
                </label>
                <Slider
                  value={[settings.saccadeStrength]}
                  onValueChange={handleSaccadeChange}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Göz hareketlerinin hızını optimize eder
                </p>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Yazı Boyutu: {fontSize}px
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseFontSize}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="flex-1 text-center text-sm">
                    {fontSize}px
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseFontSize}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Okuma konforunuzu ayarlayın
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bionic Text Content */}
      <Card>
        <CardContent className="p-8">
          <div
            className="bionic-text prose prose-lg max-w-none"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
            }}
            dangerouslySetInnerHTML={{
              __html: transformedText.replace(/\n/g, '<br>')
            }}
          />
        </CardContent>
      </Card>

      {/* CSS Styles */}
      <style jsx>{`
        .bionic-text {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #374151;
        }
        
        .bionic-text .bionic-bold {
          font-weight: 700;
          color: #111827;
        }
        
        .dark .bionic-text {
          color: #d1d5db;
        }
        
        .dark .bionic-text .bionic-bold {
          color: #f9fafb;
        }
        
        .bionic-text p {
          margin-bottom: 1.5em;
        }
        
        .bionic-text br {
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  )
}