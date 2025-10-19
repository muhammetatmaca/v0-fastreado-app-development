import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { pdfText, pdfTitle } = await request.json()

    if (!pdfText) {
      return NextResponse.json({ error: "PDF metni gerekli" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Aşağıdaki PDF içeriğini bir podcast senaryosuna dönüştür. Senaryo doğal, konuşma dilinde ve dinleyici dostu olmalıdır. Türkçe olarak yaz.

PDF Başlığı: ${pdfTitle}

İçerik:
${pdfText.slice(0, 10000)}

Podcast senaryosu şu yapıda olmalı:
- Giriş (konuyu tanıt)
- Ana içerik (önemli noktaları açıkla)
- Sonuç (özetleyip kapanış yap)

Senaryo yaklaşık 5-7 dakikalık bir podcast için uygun olmalı.`,
    })

    return NextResponse.json({ script: text })
  } catch (error) {
    console.error("[v0] AI podcast error:", error)
    return NextResponse.json({ error: "Podcast oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}
