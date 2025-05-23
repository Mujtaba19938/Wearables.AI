/**
 * Haptic feedback utility for web applications
 * Provides different types of haptic feedback when available
 */

export type HapticType = "light" | "medium" | "heavy" | "selection" | "impact" | "notification"

interface HapticOptions {
  pattern?: number | number[]
  duration?: number
}

class HapticManager {
  private isSupported = false
  private vibrationSupported = false

  constructor() {
    this.checkSupport()
  }

  private checkSupport() {
    // Check for modern haptic feedback API (iOS Safari)
    this.isSupported = "vibrate" in navigator || "hapticFeedback" in navigator

    // Check for basic vibration API
    this.vibrationSupported = "vibrate" in navigator

    console.log("Haptic support:", {
      isSupported: this.isSupported,
      vibrationSupported: this.vibrationSupported,
      userAgent: navigator.userAgent,
    })
  }

  /**
   * Trigger haptic feedback
   */
  public trigger(type: HapticType = "light", options: HapticOptions = {}) {
    try {
      // Try modern haptic feedback first (iOS Safari 13+)
      if (this.tryModernHaptic(type)) {
        return true
      }

      // Fallback to vibration API
      if (this.tryVibration(type, options)) {
        return true
      }

      // Log if no haptic feedback is available
      console.log("Haptic feedback not available on this device")
      return false
    } catch (error) {
      console.warn("Haptic feedback error:", error)
      return false
    }
  }

  private tryModernHaptic(type: HapticType): boolean {
    // Check for iOS Safari haptic feedback
    if ("hapticFeedback" in navigator) {
      try {
        // @ts-ignore - hapticFeedback is not in TypeScript definitions yet
        navigator.hapticFeedback.vibrate(this.getHapticPattern(type))
        return true
      } catch (error) {
        console.warn("Modern haptic feedback failed:", error)
      }
    }

    // Check for experimental haptic feedback API
    if ("vibrate" in navigator && typeof (navigator as any).vibrate === "function") {
      try {
        const pattern = this.getVibrationPattern(type)
        if (pattern) {
          navigator.vibrate(pattern)
          return true
        }
      } catch (error) {
        console.warn("Vibration API failed:", error)
      }
    }

    return false
  }

  private tryVibration(type: HapticType, options: HapticOptions): boolean {
    if (!this.vibrationSupported) return false

    try {
      const pattern = options.pattern || this.getVibrationPattern(type)
      if (pattern) {
        navigator.vibrate(pattern)
        return true
      }
    } catch (error) {
      console.warn("Vibration failed:", error)
    }

    return false
  }

  private getHapticPattern(type: HapticType): string {
    switch (type) {
      case "light":
        return "light"
      case "medium":
        return "medium"
      case "heavy":
        return "heavy"
      case "selection":
        return "selection"
      case "impact":
        return "impact"
      case "notification":
        return "notification"
      default:
        return "light"
    }
  }

  private getVibrationPattern(type: HapticType): number | number[] | null {
    switch (type) {
      case "light":
        return 10
      case "medium":
        return 20
      case "heavy":
        return 50
      case "selection":
        return [5, 5, 5]
      case "impact":
        return [10, 10, 10]
      case "notification":
        return [50, 50, 50, 50, 50]
      default:
        return 10
    }
  }

  /**
   * Check if haptic feedback is supported
   */
  public isHapticSupported(): boolean {
    return this.isSupported
  }

  /**
   * Trigger a custom vibration pattern
   */
  public customVibration(pattern: number | number[]): boolean {
    if (!this.vibrationSupported) return false

    try {
      navigator.vibrate(pattern)
      return true
    } catch (error) {
      console.warn("Custom vibration failed:", error)
      return false
    }
  }

  /**
   * Stop all vibrations
   */
  public stop(): void {
    if (this.vibrationSupported) {
      try {
        navigator.vibrate(0)
      } catch (error) {
        console.warn("Failed to stop vibration:", error)
      }
    }
  }
}

// Create singleton instance
export const haptic = new HapticManager()

// Convenience functions
export const triggerHaptic = (type: HapticType = "light", options?: HapticOptions) => {
  return haptic.trigger(type, options)
}

export const isHapticSupported = () => haptic.isHapticSupported()
