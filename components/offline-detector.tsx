"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [isLowBandwidth, setIsLowBandwidth] = useState(false)

  useEffect(() => {
    // Check initial online status
    setIsOffline(!navigator.onLine)

    // Check for low bandwidth connection
    if ("connection" in navigator) {
      const connection = (navigator as any).connection

      const updateConnectionStatus = () => {
        const isLow =
          connection.downlink < 1.5 || // less than 1.5 Mbps
          connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g" ||
          connection.effectiveType === "3g" ||
          connection.saveData === true

        setIsLowBandwidth(isLow)
      }

      updateConnectionStatus()
      connection.addEventListener("change", updateConnectionStatus)

      return () => {
        connection.removeEventListener("change", updateConnectionStatus)
      }
    }

    // Set up event listeners for online/offline events
    const handleOnline = () => {
      setIsOffline(false)
      setShowBanner(true)
      // Hide the "back online" banner after 3 seconds
      setTimeout(() => setShowBanner(false), 3000)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setShowBanner(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up event listeners
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <>
      {showBanner && isOffline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 dark:bg-red-900/90 bg-red-200 dark:text-white text-red-800 dark:border-red-700 border-red-300">
          <WifiOff className="w-4 h-4" />
          <span>You're offline. Some features may be limited.</span>
        </div>
      )}

      {showBanner && !isOffline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 dark:bg-green-900/90 bg-green-200 dark:text-white text-green-800 dark:border-green-700 border-green-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
          <span>You're back online!</span>
        </div>
      )}

      {!isOffline && isLowBandwidth && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 dark:bg-yellow-900/90 bg-yellow-200 dark:text-white text-yellow-800 dark:border-yellow-700 border-yellow-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Slow connection. Using low-bandwidth mode.</span>
        </div>
      )}
    </>
  )
}

// Add default export
export default OfflineDetector
