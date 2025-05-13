"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookieConsent")
    if (!hasConsented) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true")
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-20 sm:bottom-24 left-0 right-0 mx-auto w-11/12 max-w-md p-4 bg-card rounded-lg shadow-lg border border-border z-50 animate-fade-in">
      <div className="flex flex-col space-y-3">
        <p className="text-sm text-gray-300">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          <Link href="/privacy-policy" className="text-blue-400 hover:underline ml-1">
            Learn more
          </Link>
        </p>
        <div className="flex space-x-3 justify-end">
          <button
            onClick={declineCookies}
            className="px-3 py-1 text-xs rounded-md border border-gray-600 hover:bg-gray-700 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-3 py-1 text-xs bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
