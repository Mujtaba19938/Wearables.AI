"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BottomNavbar } from "@/components/bottom-navbar"
import { Preloader } from "@/components/preloader"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time or wait for resources
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Preloader isLoading={loading} />
          <div className={`pb-16 transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}>
            {children}
          </div>
          <BottomNavbar />
        </ThemeProvider>
      </body>
    </html>
  )
}
