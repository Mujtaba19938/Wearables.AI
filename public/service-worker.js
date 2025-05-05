// Service worker for caching face-api.js models
const CACHE_NAME = "wearables-face-models-v1"
const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models"

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

// Generate model URLs
const MODEL_URLS = MODEL_FILES.map((file) => `${MODEL_URL}/${file}`)

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

// Fetch event - serve from cache, falling back to network
self.addEventListener("fetch", (event) => {
  // Only cache the model files from the specific domain
  if (event.request.url.includes(MODEL_URL)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
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
            throw error
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
