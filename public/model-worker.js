// Service worker to cache face-api.js models
const CACHE_NAME = "face-api-models-v1"
const MODEL_URLS = [
  "/models/tiny_face_detector_model-weights_manifest.json",
  "/models/tiny_face_detector_model-shard1",
  "/models/face_landmark_68_model-weights_manifest.json",
  "/models/face_landmark_68_model-shard1",
  "/models/face_recognition_model-weights_manifest.json",
  "/models/face_recognition_model-shard1",
  "/models/face_recognition_model-shard2",
  "/models/face_expression_model-weights_manifest.json",
  "/models/face_expression_model-shard1",
]

// Install event - cache models
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(MODEL_URLS)
    }),
  )
})

// Fetch event - serve from cache if available
self.addEventListener("fetch", (event) => {
  // Only handle model requests
  if (event.request.url.includes("/models/")) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached response if found
        if (response) {
          return response
        }

        // Otherwise fetch from network
        return fetch(event.request).then((response) => {
          // Don't cache if response is not valid
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Add to cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
      }),
    )
  }
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
