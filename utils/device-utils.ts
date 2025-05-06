// Device capabilities and feature detection

// Check if device is a mobile device
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ""
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
}

// Check if device is a tablet
export function isTabletDevice(): boolean {
  if (typeof window === "undefined") return false

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ""
  return (
    /ipad|android(?!.*mobile)/i.test(userAgent.toLowerCase()) ||
    (navigator.maxTouchPoints === 5 && /macintosh/i.test(userAgent.toLowerCase()))
  )
}

// Check if device has touch capability
export function hasTouchScreen(): boolean {
  if (typeof window === "undefined") return false

  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0
}

// Get device pixel ratio for high DPI screens
export function getDevicePixelRatio(): number {
  if (typeof window === "undefined") return 1

  return window.devicePixelRatio || 1
}

// Check if device is on a slow connection
export function isSlowConnection(): boolean {
  if (typeof navigator === "undefined" || !(navigator as any).connection) return false

  const connection = (navigator as any).connection
  return connection.saveData || (connection.effectiveType && ["slow-2g", "2g", "3g"].includes(connection.effectiveType))
}

// Check if device has limited memory
export function hasLimitedMemory(): boolean {
  if (typeof navigator === "undefined" || navigator.deviceMemory === undefined) return false

  return navigator.deviceMemory < 4 // Less than 4GB of RAM
}

// Get optimal image size based on device
export function getOptimalImageSize(defaultWidth = 800, defaultHeight = 600): { width: number; height: number } {
  if (typeof window === "undefined") {
    return { width: defaultWidth, height: defaultHeight }
  }

  const pixelRatio = getDevicePixelRatio()
  const isLowPower = hasLimitedMemory() || isSlowConnection()

  if (isLowPower) {
    // Provide smaller images for low-power devices
    return {
      width: Math.round(defaultWidth / 2),
      height: Math.round(defaultHeight / 2),
    }
  } else if (pixelRatio > 1) {
    // Provide high-res images for high DPI screens
    return {
      width: Math.round(defaultWidth * pixelRatio),
      height: Math.round(defaultHeight * pixelRatio),
    }
  }

  return { width: defaultWidth, height: defaultHeight }
}

// Check for reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Get device orientation
export function getDeviceOrientation(): "portrait" | "landscape" {
  if (typeof window === "undefined") return "portrait"

  return window.innerHeight > window.innerWidth ? "portrait" : "landscape"
}

// Detect iOS devices
export function isIOSDevice(): boolean {
  if (typeof window === "undefined") return false

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

// Check if device has notch
export function hasNotch(): boolean {
  if (typeof window === "undefined") return false

  // iOS devices with notch detection
  if (isIOSDevice() && window.screen.height >= 812) {
    return true
  }

  // Android devices (less reliable detection)
  if (/Android/.test(navigator.userAgent)) {
    return window.innerHeight / window.innerWidth < 1.8
  }

  return false
}
