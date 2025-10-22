"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, User, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    icon: Home,
    label: "Ana Sayfa"
  },
  {
    href: "/library",
    icon: BookOpen,
    label: "Kütüphane"
  },
  {
    href: "/pricing",
    icon: Zap,
    label: "Premium"
  },
  {
    href: "/account",
    icon: User,
    label: "Profil"
  }
]

export function MobileNavbar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}