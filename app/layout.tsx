import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNavbar } from "@/components/bottom-navbar"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"
import { OfflineDetector } from "@/components/offline-detector"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "wearables.ai - Face Shape Analyzer",
  description: "Find the perfect eyeglasses for your face shape",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-[#0a0a1a] text-white min-h-screen`}>
        <ServiceWorkerRegistration />
        <OfflineDetector />
        {children}
        <BottomNavbar />
      </body>
    </html>
  )
}
