const CACHE_NAME = "mindreminder-v1"
const STATIC_CACHE_NAME = "mindreminder-static-v1"

// URLs to cache on install
const STATIC_URLS = ["/", "/manifest.json", "/offline"]

// API routes that should not be cached
const API_ROUTES = ["/api/reminders", "/api/micro-actions", "/api/auth"]

// App routes (pages) that exist
const APP_ROUTES = ["/", "/reminders", "/micro-actions", "/settings", "/login", "/signup"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Handle API routes - always go to network
  if (API_ROUTES.some((route) => url.pathname.startsWith(route))) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: "Network unavailable" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      }),
    )
    return
  }

  // Handle app routes (pages)
  if (request.method === "GET") {
    // For navigation requests, try network first, then cache
    if (request.mode === "navigate") {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
          .catch(() => {
            // Try to serve from cache
            return caches.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Fallback to offline page if available
              return caches.match("/offline")
            })
          }),
      )
      return
    }

    // For other GET requests (assets, etc.)
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
      }),
    )
  }
})

// Handle background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle any queued actions when back online
  console.log("Background sync triggered")
}
