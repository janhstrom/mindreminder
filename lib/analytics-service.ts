"use client"

import { supabase } from "./supabase"

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

export class AnalyticsService {
  private static instance: AnalyticsService | null = null
  private sessionId: string
  private sessionStart: number
  private isClient: boolean

  private constructor() {
    this.isClient = typeof window !== "undefined"
    this.sessionId = this.generateSessionId()
    this.sessionStart = this.isClient ? Date.now() : 0

    if (this.isClient) {
      this.initializeSession()
    }
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeSession() {
    if (!this.isClient) return

    // Track session start
    this.trackEvent("session_start", {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    })

    // Track session end on page unload
    window.addEventListener("beforeunload", () => {
      this.trackEvent("session_end", {
        duration: Date.now() - this.sessionStart,
        timestamp: new Date().toISOString(),
      })
    })

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      this.trackEvent("visibility_change", {
        hidden: document.hidden,
        timestamp: new Date().toISOString(),
      })
    })
  }

  async trackEvent(eventType: string, eventData: Record<string, any> = {}, userId?: string) {
    if (!this.isClient) return

    try {
      const event: Omit<UserEvent, "id"> = {
        userId: userId || "anonymous",
        eventType,
        eventData: {
          ...eventData,
          sessionId: this.sessionId,
          url: window.location.href,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        page: window.location.pathname,
      }

      // Store in Supabase
      await supabase.from("user_events").insert([event])

      // Also send to Google Analytics if available
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventType, {
          event_category: eventData.category || "engagement",
          event_label: eventData.label,
          value: eventData.value,
          custom_parameter_1: eventData.sessionId,
          custom_parameter_2: userId,
        })
      }
    } catch (error) {
      console.error("Error tracking event:", error)
    }
  }

  // Enhanced tracking methods
  async trackPageView(page: string, userId?: string) {
    if (!this.isClient) return

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

  // Analytics data retrieval
  async getAnalyticsData(userId: string, timeRange: string): Promise<AnalyticsData> {
    // This would typically fetch from your analytics database
    // For now, return mock data
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
    if (!this.isClient) return

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

// Create a safe instance getter that can be used in both client and server
export const getAnalyticsService = (): AnalyticsService | null => {
  if (typeof window === "undefined") {
    return null
  }
  return AnalyticsService.getInstance()
}
