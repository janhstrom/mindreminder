"use client"

export interface AnalyticsData {
  overview: {
    totalSessions: number
    sessionsChange: number
    avgSessionTime: string
    sessionTimeChange: number
    remindersCreated: number
    remindersChange: number
    engagementScore: number
    engagementChange: number
  }
  featureMetrics: Array<{
    name: string
    usage: number
    change: number
    trend: "up" | "down"
  }>
  topActions: Array<{
    name: string
    count: number
    percentage: number
  }>
  performance: {
    pageLoadTime: number
    errorRate: number
    bounceRate: number
  }
}

export interface UserEvent {
  userId: string
  eventType: string
  eventData: Record<string, any>
  timestamp: string
  sessionId: string
  userAgent: string
  page: string
}

class AnalyticsServiceImpl {
  private sessionId: string
  private sessionStart: number
  private initialized = false
  private analyticsEnabled = false // Disabled by default for now

  constructor() {
    this.sessionId = this.generateSessionId()
    this.sessionStart = Date.now()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async initialize() {
    if (this.initialized || typeof window === "undefined") return

    this.initialized = true
    console.log("Analytics service initialized (disabled for debugging)")

    // For now, let's skip the database test and just use local analytics
    // We'll enable this later once we figure out the Supabase issue

    // Track session end on page unload
    window.addEventListener("beforeunload", () => {
      console.log("Session ended, duration:", Date.now() - this.sessionStart, "ms")
    })

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      console.log("Visibility changed:", document.hidden ? "hidden" : "visible")
    })
  }

  async trackEvent(eventType: string, eventData: Record<string, any> = {}, userId?: string) {
    if (typeof window === "undefined") return

    // For now, just log to console instead of saving to database
    console.log("Analytics Event:", {
      eventType,
      eventData,
      userId,
      sessionId: this.sessionId,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    })

    // Send to Google Analytics if available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventType, {
        event_category: eventData.category || "engagement",
        event_label: eventData.label,
        value: eventData.value,
        custom_parameter_1: this.sessionId,
        custom_parameter_2: userId,
      })
    }
  }

  async trackPageView(page: string, userId?: string) {
    if (typeof window === "undefined") return

    await this.trackEvent(
      "page_view",
      {
        page,
        title: document.title,
        category: "navigation",
      },
      userId,
    )
  }

  async trackUserAction(action: string, details: Record<string, any> = {}, userId?: string) {
    await this.trackEvent(
      "user_action",
      {
        action,
        ...details,
        category: "interaction",
      },
      userId,
    )
  }

  async trackFeatureUsage(feature: string, details: Record<string, any> = {}, userId?: string) {
    await this.trackEvent(
      "feature_usage",
      {
        feature,
        ...details,
        category: "features",
      },
      userId,
    )
  }

  async trackError(error: string, details: Record<string, any> = {}, userId?: string) {
    await this.trackEvent(
      "error",
      {
        error,
        ...details,
        category: "errors",
      },
      userId,
    )
  }

  async trackPerformance(metric: string, value: number, userId?: string) {
    await this.trackEvent(
      "performance",
      {
        metric,
        value,
        category: "performance",
      },
      userId,
    )
  }

  async getAnalyticsData(userId: string, timeRange: string): Promise<AnalyticsData> {
    // Return mock data for the dashboard
    return {
      overview: {
        totalSessions: 156,
        sessionsChange: 12.5,
        avgSessionTime: "4m 32s",
        sessionTimeChange: 8.2,
        remindersCreated: 89,
        remindersChange: 15.3,
        engagementScore: 78,
        engagementChange: 5.1,
      },
      featureMetrics: [
        { name: "Reminders", usage: 89, change: 15.3, trend: "up" },
        { name: "Quotes", usage: 45, change: -2.1, trend: "down" },
        { name: "Friends", usage: 23, change: 8.7, trend: "up" },
        { name: "Sharing", usage: 12, change: 3.2, trend: "up" },
      ],
      topActions: [
        { name: "Create Reminder", count: 89, percentage: 35.2 },
        { name: "View Dashboard", count: 67, percentage: 26.5 },
        { name: "Generate Quote", count: 45, percentage: 17.8 },
        { name: "Share Reminder", count: 34, percentage: 13.4 },
        { name: "Update Settings", count: 18, percentage: 7.1 },
      ],
      performance: {
        pageLoadTime: 1240,
        errorRate: 0.8,
        bounceRate: 23.4,
      },
    }
  }

  async exportAnalyticsData(userId: string, timeRange: string): Promise<void> {
    if (typeof window === "undefined") return

    const data = await this.getAnalyticsData(userId, timeRange)
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `mindreminder-analytics-${timeRange}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
}

// Lazy singleton that only creates instance when needed on client
let analyticsInstance: AnalyticsServiceImpl | null = null

export const getAnalyticsService = (): AnalyticsServiceImpl | null => {
  if (typeof window === "undefined") {
    return null
  }

  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsServiceImpl()
    analyticsInstance.initialize()
  }

  return analyticsInstance
}

// Safe analytics functions that can be called from anywhere
export const trackEvent = (eventType: string, eventData?: Record<string, any>, userId?: string) => {
  const service = getAnalyticsService()
  service?.trackEvent(eventType, eventData, userId)
}

export const trackPageView = (page: string, userId?: string) => {
  const service = getAnalyticsService()
  service?.trackPageView(page, userId)
}

export const trackUserAction = (action: string, details?: Record<string, any>, userId?: string) => {
  const service = getAnalyticsService()
  service?.trackUserAction(action, details, userId)
}

export const trackFeatureUsage = (feature: string, details?: Record<string, any>, userId?: string) => {
  const service = getAnalyticsService()
  service?.trackFeatureUsage(feature, details, userId)
}
