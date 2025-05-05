"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { BottomNavbar } from "@/components/bottom-navbar"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="face-analyzer-theme">
      <div className="min-h-screen bg-[#0a0a1a] text-foreground">
        {children}
        <BottomNavbar />
      </div>
    </ThemeProvider>
  )
}
