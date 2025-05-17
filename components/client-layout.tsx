"use client"

import type React from "react"

import { useEffect, useState, createContext, useContext } from "react"
import BottomNavbar from "./bottom-navbar"
import AnimatedBackground from "./animated-background"
import Preloader from "./preloader"
import Link from "next/link"

// Create a simple toast context
type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])

    if (duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-md">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-4 rounded-md shadow-lg text-white flex items-start justify-between ${
                toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"
              }`}
            >
              <p>{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-white hover:text-gray-200"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

// Custom hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showCookieConsent, setShowCookieConsent] = useState(false)

  useEffect(() => {
    // Check for online/offline status
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Initial check
    setIsOffline(!navigator.onLine)

    // Scroll to top functionality
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)

    // Check if cookie consent has been given
    const hasConsent = localStorage.getItem("cookieConsent") === "true"
    if (!hasConsent) {
      // Delay showing cookie consent to avoid it appearing during preloader
      const consentTimer = setTimeout(() => {
        setShowCookieConsent(true)
      }, 2000)
      return () => {
        clearTimeout(consentTimer)
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
        window.removeEventListener("scroll", handleScroll)
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true")
    setShowCookieConsent(false)
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col relative w-full overflow-x-hidden">
        {/* Preloader */}
        {isLoading && <Preloader onLoadingComplete={handleLoadingComplete} minimumDisplayTime={2000} />}

        {/* Animated background - only visible when not loading */}
        <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
          <AnimatedBackground />
        </div>

        {!isLoading && (
          <>
            {/* Inline offline indicator */}
            {isOffline && (
              <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black p-2 text-center z-50">
                <p className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                    <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                  </svg>
                  You are currently offline. Some features may be unavailable.
                </p>
              </div>
            )}

            <main className="flex-grow w-full">{children}</main>
            <BottomNavbar />

            {/* Inline scroll to top button */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="fixed bottom-20 right-4 p-2 rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity hover:opacity-90 z-40"
                aria-label="Scroll to top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            )}

            {/* Inline cookie consent banner */}
            {showCookieConsent && (
              <div className="fixed bottom-16 inset-x-0 p-4 bg-background border-t border-border shadow-lg z-50">
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">Cookie Notice</h3>
                    <p className="text-muted-foreground">
                      We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you
                      consent to our use of cookies.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={acceptCookies}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Accept
                    </button>
                    <Link
                      href="/cookie-policy"
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToastProvider>
  )
}
