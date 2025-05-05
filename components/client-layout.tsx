"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "../app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BottomNavbar } from "@/components/bottom-navbar"
import { Preloader } from "@/components/preloader"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import ErrorBoundary from "@/components/error-boundary"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Register service worker for model caching
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      try {
        // Only register in production environments
        if (!window.location.hostname.includes("localhost") && !window.location.hostname.includes("vusercontent.net")) {
          navigator.serviceWorker.register("/service-worker.js").catch(console.error)
        }
      } catch (error) {
        console.error("Service worker registration failed:", error)
      }
    }

    // Simulate loading time or wait for resources
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          <div className={inter.className}>
            <Preloader isVisible={loading} />
            <div className={`transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}>{children}</div>
            <BottomNavbar />
            <Toaster />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
