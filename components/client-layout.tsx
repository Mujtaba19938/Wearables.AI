"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { BottomNavbar } from "@/components/bottom-navbar"
import { ThemeToggleCorner } from "@/components/theme-toggle-corner"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="face-analyzer-theme">
      <div className="min-h-screen bg-background text-foreground">
        <ThemeToggleCorner />
        {children}
        <BottomNavbar />
      </div>
    </ThemeProvider>
  )
}
