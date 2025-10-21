import type React from "react"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import AnimatedBackground from "@/components/animated-background"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "Fastreado - Speed Reading App",
  description: "Read faster with RSVP and Bionic Reading modes",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} has-animated-bg`}>
        {/* Inline critical CSS to ensure page-level wrappers don't occlude the animated background */}
        <style dangerouslySetInnerHTML={{ __html: `
          .has-animated-bg .min-h-screen, .has-animated-bg .min-h-screen.bg-background, .has-animated-bg > .min-h-screen {
            background-color: transparent !important;
            background-image: none !important;
          }
          .has-animated-bg .bg-background {
            background-color: transparent !important;
            background-image: none !important;
          }
        ` }} />
        <AnimatedBackground />
        <AuthProvider>
          <div style={{ position: "relative", zIndex: 50 }}>{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}
