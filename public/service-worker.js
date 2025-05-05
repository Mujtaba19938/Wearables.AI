// Service worker for offline functionality
const CACHE_NAME = "face-analyzer-cache-v2"
const MODEL_CACHE_NAME = "face-api-models-v2"

// Resources to cache
const STATIC_RESOURCES = [
  "/",
  "/analyzer",
  "/frames",
  "/guide",
  "/about",
  "/profile",
  "/globals.css",
  "/placeholder.svg",
  "/round-vintage-glasses.png",
  "/frames/round-vintage.png",
  "/frames/wayfarer-classic.png",
  "/frames/cat-eye-elegance.png",
  "/frames/aviator-metal.png",
  "/frames/rectangle-acetate.png",
]

// Model files to cache
const MODEL_RESOURCES = [
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

// Install event - cache static resources and models
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches
        .open(CACHE_NAME)
        .then((cache) => {
          console.log("Caching static resources")
          return cache.addAll(STATIC_RESOURCES)
        }),

      // Cache model resources individually to prevent batch failures
      caches
        .open(MODEL_CACHE_NAME)
        .then(async (cache) => {
          console.log("Caching model resources")
          // Cache each model file individually to prevent one failure from stopping all caching
          const modelCachePromises = MODEL_RESOURCES.map(async (modelUrl) => {
            try {
              const response = await fetch(modelUrl)
              if (response.ok) {
                return cache.put(modelUrl, response)
              } else {
                console.error(`Failed to cache model: ${modelUrl}, status: ${response.status}`)
              }
            } catch (error) {
              console.error(`Error caching model: ${modelUrl}`, error)
            }
          })

          return Promise.allSettled(modelCachePromises)
        }),
    ]).then(() => {
      console.log("Resources cached successfully")
      return self.skipWaiting()
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME, MODEL_CACHE_NAME]

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Handle model requests specifically
  if (event.request.url.includes("/models/")) {
    event.respondWith(
      caches.open(MODEL_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response
          }

          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone())
            }
            return networkResponse
          })
        })
      }),
    )
    return
  }

  // For other requests, try cache first, then network with cache update
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        // Return cached response if found
        if (response) {
          // Fetch from network in the background to update cache
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse)
              }
            })
            .catch(() => {
              // Network request failed, but we already have a cached response
              console.log("Network request failed, using cached version")
            })

          return response
        }

        // If not in cache, try to fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              // Cache the response for future use
              cache.put(event.request, networkResponse.clone())
            }
            return networkResponse
          })
          .catch((error) => {
            console.error("Fetch failed:", error)

            // For HTML requests, return the offline page
            if (event.request.headers.get("accept").includes("text/html")) {
              return caches.match("/offline.html").then((offlineResponse) => {
                return (
                  offlineResponse ||
                  new Response("You are offline", {
                    status: 503,
                    headers: { "Content-Type": "text/html" },
                  })
                )
              })
            }

            // For other requests, return a simple error response
            return new Response("Network error", { status: 503 })
          })
      })
    }),
  )
})

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
