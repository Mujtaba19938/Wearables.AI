// Utility functions for model caching and loading

// Original model URL that you provided
export const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models"

// Check if the browser supports service workers
export function isCachingSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "caches" in window
}

// Register the service worker with better error handling
export async function registerServiceWorker(): Promise<boolean> {
  if (!isCachingSupported()) {
    console.log("Service workers not supported in this browser")
    return false
  }

  // In Vercel preview environments, service workers might not work as expected
  // Check if we're in a preview environment
  if (window.location.hostname.includes("vusercontent.net")) {
    console.log("Service worker registration skipped in preview environment")
    return false
  }

  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js", {
      scope: "/",
    })
    console.log("Service worker registered:", registration)
    return true
  } catch (error) {
    console.error("Service worker registration failed:", error)
    // Don't treat this as a fatal error
    return false
  }
}

// Check if models are cached - with fallback
export async function areModelsCached(): Promise<boolean> {
  if (!isCachingSupported()) return false

  try {
    const cache = await caches.open("wearables-face-models-v1")
    const keys = await cache.keys()

    // Check if we have at least one model file cached
    return keys.some((key) => key.url.includes("face-api.js/models"))
  } catch (error) {
    console.error("Error checking cached models:", error)
    return false
  }
}

// Force update of cached models - with fallback
export async function updateCachedModels(): Promise<boolean> {
  if (!isCachingSupported()) return false

  try {
    // Send message to service worker to skip waiting and activate new version
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" })
    }

    // Delete the current cache to force re-download
    await caches.delete("wearables-face-models-v1")

    return true
  } catch (error) {
    console.error("Error updating cached models:", error)
    return false
  }
}

// Helper function to check if a URL is accessible
export async function isUrlAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD", mode: "cors", cache: "no-cache" })
    return response.ok
  } catch (error) {
    return false
  }
}

// Custom model loader that works with both cached and network resources
export async function loadModelsWithCache(onProgress: (progress: number) => void): Promise<boolean> {
  try {
    // Check if models are already cached
    const modelsAreCached = await areModelsCached()

    if (modelsAreCached) {
      console.log("Using cached face models")
      onProgress(50) // Show some progress even though we're loading from cache
    } else {
      console.log("Downloading face models from network")
      onProgress(10)
    }

    // The actual loading will be handled by face-api.js
    // The service worker will intercept these requests and serve from cache if available

    return true
  } catch (error) {
    console.error("Error in loadModelsWithCache:", error)
    return false
  }
}

// Check browser capabilities for face detection
export function checkBrowserCapabilities(): {
  webgl: boolean
  webAssembly: boolean
  mediaDevices: boolean
  serviceWorker: boolean
} {
  if (typeof window === "undefined") {
    return {
      webgl: false,
      webAssembly: false,
      mediaDevices: false,
      serviceWorker: false,
    }
  }

  return {
    webgl: !!window.WebGLRenderingContext,
    webAssembly: typeof WebAssembly === "object",
    mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    serviceWorker: "serviceWorker" in navigator,
  }
}
