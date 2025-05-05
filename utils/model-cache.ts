// Utility functions for model caching and loading

// Check if the browser supports service workers
export function isCachingSupported(): boolean {
  return "serviceWorker" in navigator && "caches" in window
}

// Register the service worker
export async function registerServiceWorker(): Promise<boolean> {
  if (!isCachingSupported()) {
    console.log("Service workers not supported in this browser")
    return false
  }

  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js", {
      scope: "/",
      updateViaCache: "none", // Don't use cached version of service worker
    })
    console.log("Service worker registered:", registration)

    // Force update if needed
    if (registration.active) {
      registration.update().catch((err) => {
        console.error("Error updating service worker:", err)
      })
    }

    return true
  } catch (error) {
    console.error("Service worker registration failed:", error)
    return false
  }
}

// Check if models are cached
export async function areModelsCached(): Promise<boolean> {
  if (!isCachingSupported()) return false

  try {
    const cache = await caches.open("wearables-face-models-v1")
    const keys = await cache.keys()

    // Check if we have at least one model file cached
    return keys.some((key) => key.url.includes("face-api.js/models") || key.url.includes("face-api/model"))
  } catch (error) {
    console.error("Error checking cached models:", error)
    return false
  }
}

// Force update of cached models
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

// Custom model loader that works with both cached and network resources
export async function loadModelsWithCache(modelUrl: string, onProgress: (progress: number) => void): Promise<boolean> {
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
  return {
    webgl: !!window.WebGLRenderingContext,
    webAssembly: typeof WebAssembly === "object",
    mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    serviceWorker: "serviceWorker" in navigator,
  }
}
