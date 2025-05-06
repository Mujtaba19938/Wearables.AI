import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "@/components/client-layout"
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, viewport-fit=cover"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          <ServiceWorkerRegistration />
          <OfflineDetector />
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
