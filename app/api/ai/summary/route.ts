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
      prompt: `Aşağıdaki PDF içeriğinin kapsamlı bir özetini Türkçe olarak oluştur. Özet 3-5 paragraf olmalı ve ana fikirleri içermelidir.

PDF Başlığı: ${pdfTitle}

İçerik:
${pdfText.slice(0, 10000)} // İlk 10000 karakter

Lütfen özeti şu formatta ver:
- Ana Fikir
- Önemli Noktalar
- Sonuç`,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("[v0] AI summary error:", error)
    return NextResponse.json({ error: "Özet oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}
