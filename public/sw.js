// Service Worker for MindReMinder Push Notifications

const CACHE_NAME = "mindreminder-v1"
const urlsToCache = ["/", "/dashboard", "/manifest.json"]

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Skip service worker for API routes and specific paths
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname === "/reminders" ||
    url.pathname === "/micro-actions" ||
    url.pathname.endsWith(".json")
  ) {
    return // Let it go straight to network/Next.js
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Push event - handle incoming push notifications
self.addEventListener("push", (event) => {
  console.log("Push event received:", event)

  let notificationData = {
    title: "MindReMinder",
    body: "You have a new reminder!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "mindreminder-notification",
    requireInteraction: false,
    actions: [
      {
        action: "view",
        title: "View Reminder",
        icon: "/icon-192.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icon-192.png",
      },
    ],
    data: {
      url: "/dashboard",
      reminderId: null,
    },
  }

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json()
      notificationData = { ...notificationData, ...pushData }
    } catch (error) {
      console.error("Error parsing push data:", error)
    }
  }

  event.waitUntil(self.registration.showNotification(notificationData.title, notificationData))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event)

  event.notification.close()

  const action = event.action
  const notificationData = event.notification.data || {}

  if (action === "dismiss") {
    // Just close the notification
    return
  }

  // Default action or 'view' action - open the app
  const urlToOpen = notificationData.url || "/dashboard"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && "focus" in client) {
          return client.focus()
        }
      }

      // Open new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    }),
  )
})

// Background sync for offline functionality
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle background sync tasks
      console.log("Background sync triggered"),
    )
  }
})
