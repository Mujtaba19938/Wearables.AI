"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { BottomNavbar } from "@/components/bottom-navbar"
import { ThemeToggleCorner } from "@/components/theme-toggle-corner"
import { Preloader } from "@/components/preloader"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  // Simulate loading time or wait for resources
  useEffect(() => {
    // You can add logic here to check if resources are loaded
    // For now, we'll just use a timeout to simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500) // Show preloader for 2.5 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="face-analyzer-theme">
      <Preloader onLoadingComplete={() => setLoading(false)} />
      <div
        className={`min-h-screen bg-background text-foreground transition-all duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
      >
        <ThemeToggleCorner />
        {children}
        <BottomNavbar />
      </div>
    </ThemeProvider>
  )
}
