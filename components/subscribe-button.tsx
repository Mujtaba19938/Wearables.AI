"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, X } from "lucide-react"
import { usePathname } from "next/navigation"

export function SubscribeButton() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const pathname = usePathname()

  // Only show on home page
  const isHomePage = pathname === "/"

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSuccess(true)
      setEmail("")
      // Close modal after 3 seconds
      setTimeout(() => {
        setIsOpen(false)
        // Reset success state after modal closes
        setTimeout(() => setIsSuccess(false), 300)
      }, 3000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || !isHomePage) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white hover:scale-105 transition-all duration-300 animate-pulse-subtle shadow-md hover:shadow-lg"
        aria-label="Subscribe to newsletter"
      >
        <Mail className="h-4 w-4 mr-2" />
        <span className="font-medium">Subscribe</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div
            className="bg-card max-w-md w-full rounded-xl shadow-xl p-6 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Subscribe to our newsletter for the latest eyewear trends and app updates.
              </p>
            </div>

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">Thank You!</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You've been successfully subscribed to our newsletter.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe Now"
                  )}
                </button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
