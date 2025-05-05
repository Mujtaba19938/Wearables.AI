"use client"

import type React from "react"

import { useEffect, useState } from "react"

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Caught error:", event.error)
      setHasError(true)
      event.preventDefault()
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  if (hasError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-6">We're sorry, but there was an error loading the application.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          Reload Page
        </button>
      </div>
    )
  }

  return <>{children}</>
}
