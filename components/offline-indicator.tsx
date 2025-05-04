"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useMobile } from "@/hooks/use-mobile"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const isMobile = useMobile()

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up event listeners
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <Alert className="mb-4 bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
      <WifiOff className={`h-3 w-3 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400`} />
      <AlertDescription className={`text-amber-600 dark:text-amber-400 font-medium text-xs sm:text-sm`}>
        You are currently offline. The app will use cached models for face analysis.
      </AlertDescription>
    </Alert>
  )
}
