"use client"

export interface NotificationSettings {
  enabled: boolean
  reminders: boolean
  quotes: boolean
  location: boolean
  sound: boolean
  vibrate: boolean
}

export interface ScheduledNotification {
  id: string
  title: string
  body: string
  scheduledTime: Date
  reminderId?: string
  type: "reminder" | "quote" | "location"
  data?: Record<string, any>
}

export class NotificationService {
  private static instance: NotificationService
  private registration: ServiceWorkerRegistration | null = null
  private scheduledNotifications: Map<string, number> = new Map()

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async initialize(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported")
      return false
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      })

      console.log("Service Worker registered:", this.registration)

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready

      return true
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported")
      return "denied"
    }

    let permission = Notification.permission

    if (permission === "default") {
      permission = await Notification.requestPermission()
    }

    return permission
  }

  async isPermissionGranted(): Promise<boolean> {
    return Notification.permission === "granted"
  }

  async scheduleNotification(notification: ScheduledNotification): Promise<void> {
    const permission = await this.isPermissionGranted()
    if (!permission) {
      console.warn("Notification permission not granted")
      return
    }

    const now = new Date().getTime()
    const scheduledTime = notification.scheduledTime.getTime()
    const delay = scheduledTime - now

    if (delay <= 0) {
      // Show immediately if time has passed
      this.showNotification(notification)
      return
    }

    // Schedule for later
    const timeoutId = window.setTimeout(() => {
      this.showNotification(notification)
      this.scheduledNotifications.delete(notification.id)
    }, delay)

    this.scheduledNotifications.set(notification.id, timeoutId)

    console.log(`Notification scheduled for ${notification.scheduledTime}:`, notification.title)
  }

  async showNotification(notification: ScheduledNotification): Promise<void> {
    if (!this.registration) {
      console.warn("Service Worker not registered")
      return
    }

    const notificationOptions: NotificationOptions = {
      body: notification.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: `mindreminder-${notification.type}-${notification.id}`,
      requireInteraction: notification.type === "reminder",
      actions: [
        {
          action: "view",
          title: "View",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
      data: {
        url: "/dashboard",
        reminderId: notification.reminderId,
        type: notification.type,
        ...notification.data,
      },
    }

    // Add vibration for mobile
    if ("vibrate" in navigator) {
      notificationOptions.vibrate = [200, 100, 200]
    }

    await this.registration.showNotification(notification.title, notificationOptions)
  }

  async showTestNotification(): Promise<void> {
    const testNotification: ScheduledNotification = {
      id: "test-" + Date.now(),
      title: "🧠 MindReMinder Test",
      body: "Push notifications are working! You'll receive reminders like this.",
      scheduledTime: new Date(),
      type: "reminder",
    }

    await this.showNotification(testNotification)
  }

  cancelScheduledNotification(notificationId: string): void {
    const timeoutId = this.scheduledNotifications.get(notificationId)
    if (timeoutId) {
      clearTimeout(timeoutId)
      this.scheduledNotifications.delete(notificationId)
      console.log(`Cancelled notification: ${notificationId}`)
    }
  }

  cancelAllScheduledNotifications(): void {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    this.scheduledNotifications.clear()
    console.log("All scheduled notifications cancelled")
  }

  getNotificationSettings(): NotificationSettings {
    const stored = localStorage.getItem("notification-settings")
    if (stored) {
      return JSON.parse(stored)
    }

    // Default settings
    return {
      enabled: true,
      reminders: true,
      quotes: false,
      location: true,
      sound: true,
      vibrate: true,
    }
  }

  saveNotificationSettings(settings: NotificationSettings): void {
    localStorage.setItem("notification-settings", JSON.stringify(settings))
  }

  async scheduleReminderNotification(reminder: {
    id: string
    title: string
    description?: string
    scheduledTime?: Date
  }): Promise<void> {
    const settings = this.getNotificationSettings()

    if (!settings.enabled || !settings.reminders || !reminder.scheduledTime) {
      return
    }

    const notification: ScheduledNotification = {
      id: `reminder-${reminder.id}`,
      title: `🔔 ${reminder.title}`,
      body: reminder.description || "You have a reminder",
      scheduledTime: reminder.scheduledTime,
      reminderId: reminder.id,
      type: "reminder",
    }

    await this.scheduleNotification(notification)
  }

  async scheduleDailyQuote(): Promise<void> {
    const settings = this.getNotificationSettings()

    if (!settings.enabled || !settings.quotes) {
      return
    }

    // Schedule for 9 AM tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)

    const notification: ScheduledNotification = {
      id: `quote-${Date.now()}`,
      title: "✨ Daily Inspiration",
      body: "Your daily dose of motivation is ready!",
      scheduledTime: tomorrow,
      type: "quote",
    }

    await this.scheduleNotification(notification)
  }

  // Location-based notifications (would need geolocation API)
  async scheduleLocationNotification(reminder: {
    id: string
    title: string
    location: string
  }): Promise<void> {
    const settings = this.getNotificationSettings()

    if (!settings.enabled || !settings.location) {
      return
    }

    // This would integrate with geolocation API
    console.log(`Location notification scheduled for: ${reminder.location}`)
  }
}
