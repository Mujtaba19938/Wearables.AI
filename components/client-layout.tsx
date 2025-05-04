"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Preloader } from "@/components/preloader"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  // Initial app loading
  useEffect(() => {
    // Set a timeout to simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Preloader isVisible={loading} />
      <div className="transition-opacity duration-500" style={{ opacity: loading ? 0 : 1 }}>
        {children}
      </div>
    </>
  )
}
