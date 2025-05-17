"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Cookie, CheckCircle, XCircle } from "lucide-react"

interface CookiePreferencesProps {
  isOpen: boolean
  onClose: () => void
}

export function CookiePreferences({ isOpen, onClose }: CookiePreferencesProps) {
  const [preferences, setPreferences] = useState({
    essential: true, // Essential cookies cannot be disabled
    analytics: true,
    functional: true,
    advertising: false,
  })

  // Load saved preferences when component mounts
  useEffect(() => {
    const savedPreferences = localStorage.getItem("cookiePreferences")
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences({
          ...preferences,
          ...parsed,
          essential: true, // Essential cookies always enabled
        })
      } catch (error) {
        console.error("Error parsing cookie preferences:", error)
      }
    }
  }, [])

  const savePreferences = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences))
    localStorage.setItem("cookieConsent", "true")
    onClose()
  }

  const acceptAll = () => {
    const allEnabled = {
      essential: true,
      analytics: true,
      functional: true,
      advertising: true,
    }
    setPreferences(allEnabled)
    localStorage.setItem("cookiePreferences", JSON.stringify(allEnabled))
    localStorage.setItem("cookieConsent", "true")
    onClose()
  }

  const rejectNonEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      functional: false,
      advertising: false,
    }
    setPreferences(essentialOnly)
    localStorage.setItem("cookiePreferences", JSON.stringify(essentialOnly))
    localStorage.setItem("cookieConsent", "true")
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Cookie className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-bold">Cookie Preferences</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Customize your cookie preferences below. Some cookies are essential for the website to function properly
                and cannot be disabled.
              </p>

              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium">Essential Cookies</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Required for the application to function properly
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded mr-2">
                      Required
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={preferences.essential}
                        disabled
                        className="sr-only"
                        id="essential-cookies"
                      />
                      <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-6 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform translate-x-4"></div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium">Analytics Cookies</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Help us improve our application by collecting anonymous usage data
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only"
                      id="analytics-cookies"
                    />
                    <label
                      htmlFor="analytics-cookies"
                      className={`block w-10 h-6 rounded-full transition-colors ${
                        preferences.analytics ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                      } cursor-pointer`}
                    ></label>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        preferences.analytics ? "translate-x-4" : ""
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium">Functional Cookies</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable enhanced functionality and personalization
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                      className="sr-only"
                      id="functional-cookies"
                    />
                    <label
                      htmlFor="functional-cookies"
                      className={`block w-10 h-6 rounded-full transition-colors ${
                        preferences.functional ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                      } cursor-pointer`}
                    ></label>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        preferences.functional ? "translate-x-4" : ""
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Advertising Cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium">Advertising Cookies</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Used to show relevant advertisements and marketing campaigns
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={preferences.advertising}
                      onChange={(e) => setPreferences({ ...preferences, advertising: e.target.checked })}
                      className="sr-only"
                      id="advertising-cookies"
                    />
                    <label
                      htmlFor="advertising-cookies"
                      className={`block w-10 h-6 rounded-full transition-colors ${
                        preferences.advertising ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                      } cursor-pointer`}
                    ></label>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        preferences.advertising ? "translate-x-4" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <button
                  onClick={acceptAll}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept All
                </button>
                <button
                  onClick={rejectNonEssential}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Essential Only
                </button>
                <button
                  onClick={savePreferences}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookiePreferences
