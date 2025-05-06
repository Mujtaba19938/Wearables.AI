"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { isHapticSupported } from "@/utils/haptic-feedback"

interface HapticContextType {
  isEnabled: boolean
  isSupported: boolean
  toggleHaptic: () => void
}

const HapticContext = createContext<HapticContextType>({
  isEnabled: true,
  isSupported: false,
  toggleHaptic: () => {},
})

export const useHaptic = () => useContext(HapticContext)

export function HapticProvider({ children }: { children: React.ReactNode }) {
  const [isSupported, setIsSupported] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Check if haptic feedback is supported
    setIsSupported(isHapticSupported())

    // Try to load user preference from localStorage
    try {
      const storedPreference = localStorage.getItem("hapticFeedback")
      if (storedPreference !== null) {
        setIsEnabled(storedPreference === "true")
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  const toggleHaptic = () => {
    const newValue = !isEnabled
    setIsEnabled(newValue)

    // Save preference to localStorage
    try {
      localStorage.setItem("hapticFeedback", String(newValue))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  return <HapticContext.Provider value={{ isEnabled, isSupported, toggleHaptic }}>{children}</HapticContext.Provider>
}
