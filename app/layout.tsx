import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import ClientLayout from "@/components/client-layout"
import { FaviconHead } from "@/components/favicon-head"

export const metadata: Metadata = {
  title: "Wearables.ai - Face Shape Analyzer",
  description: "Find the perfect eyewear for your face shape",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <FaviconHead />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
