"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { BottomNavbar } from "@/components/bottom-navbar"
import { ThemeToggleCorner } from "@/components/theme-toggle-corner"
import { Preloader } from "@/components/preloader"
import { AnimatedBackground } from "@/components/animated-background"
import { isLowPowerDevice } from "@/utils/performance-utils"
import { prefersReducedMotion } from "@/utils/device-utils"
import { HapticProvider } from "@/contexts/haptic-context"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"
import { OfflineDetector } from "@/components/offline-detector"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isLowPower, setIsLowPower] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Simulate loading time or wait for resources
  useEffect(() => {
    // You can add logic here to check if resources are loaded
    // For now, we'll just use a timeout to simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500) // Show preloader for 2.5 seconds

    // Check for low-power mode
    setIsLowPower(isLowPowerDevice())

    // Check for reduced motion preference
    setReducedMotion(prefersReducedMotion())

    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="face-analyzer-theme">
      <HapticProvider>
        <Preloader onLoadingComplete={() => setLoading(false)} />
        <div
          className={`min-h-screen bg-transparent text-foreground transition-all duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
        >
          <AnimatedBackground reducedMotion={reducedMotion} lowPowerMode={isLowPower} />
          <ServiceWorkerRegistration />
          <OfflineDetector />
          <ThemeToggleCorner />
          {children}
          <BottomNavbar />
        </div>
      </HapticProvider>
    </ThemeProvider>
  )
}
