"use client"

import { useCallback, useEffect, useState } from "react"
import { haptic, type HapticType } from "@/utils/haptic"

interface UseHapticOptions {
  enabled?: boolean
  respectUserPreferences?: boolean
}

export function useHaptic(options: UseHapticOptions = {}) {
  const { enabled = true, respectUserPreferences = true } = options
  const [isSupported, setIsSupported] = useState(false)
  const [userPreference, setUserPreference] = useState(true)

  useEffect(() => {
    setIsSupported(haptic.isHapticSupported())

    // Check user preference for reduced motion
    if (respectUserPreferences) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      setUserPreference(!mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setUserPreference(!e.matches)
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [respectUserPreferences])

  const trigger = useCallback(
    (type: HapticType = "light") => {
      if (!enabled || !isSupported || !userPreference) {
        return false
      }

      return haptic.trigger(type)
    },
    [enabled, isSupported, userPreference],
  )

  const triggerSelection = useCallback(() => trigger("selection"), [trigger])
  const triggerImpact = useCallback(() => trigger("impact"), [trigger])
  const triggerLight = useCallback(() => trigger("light"), [trigger])
  const triggerMedium = useCallback(() => trigger("medium"), [trigger])
  const triggerHeavy = useCallback(() => trigger("heavy"), [trigger])
  const triggerNotification = useCallback(() => trigger("notification"), [trigger])

  const stop = useCallback(() => {
    haptic.stop()
  }, [])

  return {
    trigger,
    triggerSelection,
    triggerImpact,
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerNotification,
    stop,
    isSupported,
    userPreference,
  }
}
