// Service worker for caching face-api.js models
const CACHE_NAME = "wearables-face-models-v1"

// Define multiple model sources to try
const MODEL_SOURCES = [
  "https://justadudewhohacks.github.io/face-api.js/models",
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model",
  "https://cdn.jsdelivr.net/npm/face-api.js/weights",
]

// List of model files to cache
const MODEL_FILES = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
  "age_gender_model-weights_manifest.json",
  "age_gender_model-shard1",
  "face_expression_model-weights_manifest.json",
  "face_expression_model-shard1",
]

// Generate all possible model URLs
const MODEL_URLS = MODEL_SOURCES.flatMap((source) => MODEL_FILES.map((file) => `${source}/${file}`))

// Install event - cache models when service worker is installed
self.addEventListener("install", (event) => {
  console.log("Service worker: Installing...")

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service worker: Caching model files")
        // We'll try to cache files but won't fail if some aren't available
        return Promise.allSettled(
          MODEL_URLS.map((url) =>
            fetch(url, { mode: "cors", credentials: "omit" })
              .then((response) => {
                if (response.ok) {
                  return cache.put(url, response)
                }
                console.log(`Failed to cache: ${url}`)
                return Promise.resolve()
              })
              .catch((err) => {
                console.log(`Error fetching ${url}: ${err.message}`)
                return Promise.resolve()
              }),
          ),
        )
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service worker: Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service worker: Now ready to handle fetches!")
        return self.clients.claim()
      }),
  )
})

// Helper function to find the right model URL
async function findModelInCache(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  // If not found, try alternative URLs
  const url = new URL(request.url)
  const fileName = url.pathname.split("/").pop()

  for (const source of MODEL_SOURCES) {
    const alternativeUrl = `${source}/${fileName}`
    if (alternativeUrl !== request.url) {
      const alternativeResponse = await cache.match(alternativeUrl)
      if (alternativeResponse) {
        return alternativeResponse
      }
    }
  }

  return null
}

// Fetch event - serve from cache, falling back to network
self.addEventListener("fetch", (event) => {
  // Only cache the model files from the specific domains
  if (MODEL_SOURCES.some((source) => event.request.url.includes(source))) {
    event.respondWith(
      findModelInCache(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log("Service worker: Serving from cache", event.request.url)
          return cachedResponse
        }

        console.log("Service worker: Fetching from network", event.request.url)
        return fetch(event.request, { mode: "cors", credentials: "omit" })
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
              console.log("Service worker: Bad response from network", event.request.url)
              throw new Error("Bad network response")
            }

            // Cache the new resource for future use
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })

            return networkResponse
          })
          .catch((error) => {
            console.log("Service worker: Network fetch failed", error)

            // If we have local models, try to serve those as a last resort
            return caches.match(`/models/${event.request.url.split("/").pop()}`).then((localResponse) => {
              if (localResponse) {
                console.log("Service worker: Serving from local models")
                return localResponse
              }

              console.log("Service worker: No cached or local version available")
              throw error
            })
          })
      }),
    )
  }
})

// Message event - handle messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
