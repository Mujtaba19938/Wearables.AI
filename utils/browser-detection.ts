export type BrowserInfo = {
  name: string
  version: string
  mobile: boolean
  os: string
  compatible: boolean
}

export function detectBrowser(): BrowserInfo {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  let browserName = "unknown"
  let browserVersion = "unknown"
  let isMobile = false
  let osName = "unknown"
  let compatible = true

  // Detect if mobile
  if (/android/i.test(userAgent)) {
    isMobile = true
    osName = "Android"

    // Chrome on Android has specific issues with face-api.js
    if (/Chrome\//.test(userAgent)) {
      browserName = "Chrome"
      const match = userAgent.match(/Chrome\/(\d+)/)
      browserVersion = match ? match[1] : "unknown"

      // Mark older Chrome on Android versions as incompatible
      compatible = Number.parseInt(browserVersion) >= 90
    }
  } else if (/iPad|iPhone|iPod/.test(userAgent)) {
    isMobile = true
    osName = "iOS"

    if (/CriOS\//.test(userAgent)) {
      browserName = "Chrome"
      const match = userAgent.match(/CriOS\/(\d+)/)
      browserVersion = match ? match[1] : "unknown"
    } else if (/FxiOS\//.test(userAgent)) {
      browserName = "Firefox"
      compatible = false // Firefox on iOS has issues with face-api
    } else if (/EdgiOS\//.test(userAgent)) {
      browserName = "Edge"
    } else {
      browserName = "Safari"
      const match = userAgent.match(/Version\/(\d+)/)
      browserVersion = match ? match[1] : "unknown"

      // Mark older Safari versions as incompatible
      compatible = Number.parseInt(browserVersion) >= 13
    }
  } else {
    // Desktop browsers
    if (/Firefox\//.test(userAgent)) {
      browserName = "Firefox"
      const match = userAgent.match(/Firefox\/(\d+)/)
      browserVersion = match ? match[1] : "unknown"
    } else if (/Edge\//.test(userAgent) || /Edg\//.test(userAgent)) {
      browserName = "Edge"
      const match = userAgent.match(/Edge\/(\d+)/) || userAgent.match(/Edg\/(\d+)/)
      browserVersion = match ? match[1] : "unknown"
    } else if (/Chrome\//.test(userAgent)) {
      browserName = "Chrome"
      const match = userAgent.match(/Chrome\/(\d+)/)
      browserVersion = match ? match[1] : "unknown"
    } else if (/Safari\//.test(userAgent)) {
      browserName = "Safari"
      const match = userAgent.match(/Version\/(\d+)/)
      browserVersion = match ? match[1] : "unknown"

      // Mark older Safari versions as incompatible
      compatible = Number.parseInt(browserVersion) >= 13
    } else if (/Trident\//.test(userAgent) || /MSIE/.test(userAgent)) {
      browserName = "Internet Explorer"
      compatible = false // IE is not compatible with face-api
    }

    if (/Windows/.test(userAgent)) {
      osName = "Windows"
    } else if (/Macintosh/.test(userAgent)) {
      osName = "macOS"
    } else if (/Linux/.test(userAgent)) {
      osName = "Linux"
    }
  }

  // Check for WebGL support (required by face-api.js)
  try {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) {
      compatible = false
    }
  } catch (e) {
    compatible = false
  }

  // Check available memory - face-api needs significant resources
  if (navigator.deviceMemory !== undefined && navigator.deviceMemory < 2) {
    compatible = false
  }

  return {
    name: browserName,
    version: browserVersion,
    mobile: isMobile,
    os: osName,
    compatible,
  }
}

// Check if we can use the simplified fallback mode
export function canUseFallbackMode(): boolean {
  const browser = detectBrowser()

  // Simplified mode works on most modern browsers, even if full face-api doesn't
  return !browser.compatible && browser.name !== "Internet Explorer"
}
