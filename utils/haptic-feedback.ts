/**
 * Utility functions for haptic feedback
 */

// Check if vibration is supported
export const isHapticSupported = (): boolean => {
  return typeof window !== "undefined" && "vibrate" in navigator
}

// Get user preference for haptic feedback
export const getHapticPreference = (): boolean => {
  if (typeof window === "undefined") return true

  try {
    const preference = localStorage.getItem("hapticFeedback")
    return preference === null ? true : preference === "true"
  } catch (error) {
    return true // Default to enabled if localStorage is not available
  }
}

// Trigger a subtle haptic feedback
export const triggerHaptic = (pattern: number | number[] = 10): void => {
  if (isHapticSupported() && getHapticPreference()) {
    try {
      navigator.vibrate(pattern)
    } catch (error) {
      console.error("Error triggering haptic feedback:", error)
    }
  }
}

// Different haptic patterns
export const hapticPatterns = {
  light: 10, // Very subtle tap (10ms)
  medium: 20, // Medium tap (20ms)
  heavy: 30, // Stronger tap (30ms)
  success: [10, 30, 10], // Success pattern
  error: [30, 20, 40, 20], // Error pattern
  warning: [20, 40, 20], // Warning pattern
}
