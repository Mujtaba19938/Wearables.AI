/**
 * Detects if the user prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Detects if the device is an iOS device
 * @returns boolean indicating if the device is iOS
 */
export function isIOSDevice(): boolean {
  if (typeof window === "undefined") return false

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  )
}

/**
 * Detects if the device has a notch (iPhone X and newer)
 * @returns boolean indicating if the device has a notch
 */
export function hasNotch(): boolean {
  if (typeof window === "undefined") return false

  // Check for iOS device first
  if (!isIOSDevice()) return false

  // iOS devices with notches have a safe area inset
  const hasSafeArea = CSS.supports("padding-top: env(safe-area-inset-top)")

  // Additional check for iPhone X and newer models
  const isNeweriPhone = /iPhone X|iPhone 1[1-9]|iPhone 2[0-9]/.test(navigator.userAgent)

  return hasSafeArea || isNeweriPhone
}

/**
 * Detects if the device is a mobile device
 * @returns boolean indicating if the device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detects if the device is a tablet
 * @returns boolean indicating if the device is a tablet
 */
export function isTabletDevice(): boolean {
  if (typeof window === "undefined") return false

  const userAgent = navigator.userAgent.toLowerCase()

  return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
    userAgent,
  )
}

/**
 * Gets the device orientation
 * @returns 'portrait' or 'landscape'
 */
export function getDeviceOrientation(): "portrait" | "landscape" {
  if (typeof window === "undefined") return "portrait"

  return window.innerHeight > window.innerWidth ? "portrait" : "landscape"
}

/**
 * Detects if the device supports touch events
 * @returns boolean indicating if touch is supported
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false

  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

export function getOptimalImageSize(width: number, height: number): { width: number; height: number } {
  // This is a placeholder implementation.  A real implementation would
  // consider network speed, device resolution, and other factors.
  return { width, height }
}

export function isSlowConnection(): boolean {
  if (typeof navigator === "undefined" || !("connection" in navigator)) {
    return false
  }

  const connection = (navigator as any).connection

  // Check for browser-specific properties
  const isSlow = connection.effectiveType === "slow-2g" || connection.saveData

  return isSlow
}
