// Simple mobile detector that runs before any face-api.js code
export function isMobileBrowser(): boolean {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ""

  // Check for common mobile patterns
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

  return mobileRegex.test(userAgent)
}

// Check if we should use the standalone analyzer instead of face-api.js
export function shouldUseStandaloneAnalyzer(): boolean {
  const isMobile = isMobileBrowser()

  // For now, use standalone analyzer for all mobile browsers to be safe
  // We can refine this later to only target problematic browsers
  return isMobile
}
