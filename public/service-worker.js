// Service worker for caching face-api.js models
const CACHE_NAME = "wearables-face-models-v1"
const MODEL_URLS = [
  "https://justadudewhohacks.github.io/face-api.js/models/tiny_face_detector_model-weights_manifest.json",
  "https://justadudewhohacks.github.io/face-api.js/models/tiny_face_detector_model-shard1",
  "https://justadudewhohacks.github.io/face-api.js/models/face_landmark_68_model-weights_manifest.json",
  "https://justadudewhohacks.github.io/face-api.js/models/face_landmark_68_model-shard1",
  "https://justadudewhohacks.github.io/face-api.js/models/face_recognition_model-weights_manifest.json",
  "https://justadudewhohacks.github.io/face-api.js/models/face_recognition_model-shard1",
  "https://justadudewhohacks.github.io/face-api.js/models/face_recognition_model-shard2",
]

// Install event - cache models when service worker is installed
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service worker: Caching model files")
        return cache.addAll(MODEL_URLS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
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
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, falling back to network
self.addEventListener("fetch", (event) => {
  // Only cache the model files from the specific domain
  if (event.request.url.includes("justadudewhohacks.github.io/face-api.js/models")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log("Service worker: Serving from cache", event.request.url)
          return response
        }

        console.log("Service worker: Fetching from network", event.request.url)
        return fetch(event.request).then((networkResponse) => {
          // Cache the new resource for future use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
          })
          return networkResponse
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
