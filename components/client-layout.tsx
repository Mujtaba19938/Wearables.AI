"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { BottomNavbar } from "@/components/bottom-navbar"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ThemeToggleCorner } from "@/components/theme-toggle-corner"
import { Preloader } from "@/components/preloader"
import { AnimatedBackground } from "@/components/animated-background"
import { CookieConsent } from "@/components/cookie-consent"
import { ToastProvider } from "@/contexts/toast-context"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showCookieConsent, setShowCookieConsent] = useState(false)

  useEffect(() => {
    // Check if cookie consent has been given
    const hasConsent = localStorage.getItem("cookieConsent") === "true"
    if (!hasConsent) {
      // Delay showing cookie consent to avoid it appearing during preloader
      const timer = setTimeout(() => {
        setShowCookieConsent(true)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        {isLoading ? (
          <Preloader onLoadingComplete={() => setIsLoading(false)} />
        ) : (
          <>
            <AnimatedBackground />
            <ThemeToggleCorner />
            <ScrollToTop />
            <main className="min-h-screen pt-4 pb-20">{children}</main>
            <BottomNavbar />
            {showCookieConsent && <CookieConsent onAccept={() => setShowCookieConsent(false)} />}
          </>
        )}
      </ToastProvider>
    </ThemeProvider>
  )
}

export default ClientLayout
