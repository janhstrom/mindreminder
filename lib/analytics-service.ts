"use client"

import { supabase } from "./supabase"

export interface AnalyticsData {
  overview: {
    totalSessions: number
    avgSessionTime: string
    remindersCreated: number
    engagementScore: number
    sessionsChange: number
    sessionTimeChange: number
    remindersChange: number
    engagementChange: number
  }
  dailyActivity: Array<{
    date: string
    sessions: number
    reminders: number
    quotes: number
  }>
  featureUsage: Array<{
    name: string
    value: number
  }>
  hourlyPattern: Array<{
    hour: string
    activity: number
  }>
  featureMetrics: Array<{
    name: string
    usage: number
    change: number
    trend: "up" | "down"
  }>
  engagementTrend: Array<{
    date: string
    score: number
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
  private static instance: AnalyticsService
  private sessionId: string
  private sessionStart: number

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.sessionStart = Date.now()
    this.initializeSession()
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
  async getAnalyticsData(userId: string, timeRange: "7d" | "30d" | "90d"): Promise<AnalyticsData> {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    try {
      // Get user events
      const { data: events } = await supabase
        .from("user_events")
        .select("*")
        .eq("userId", userId)
        .gte("timestamp", startDate.toISOString())
        .order("timestamp", { ascending: true })

      if (!events || events.length === 0) {
        return this.getEmptyAnalyticsData()
      }

      // Process the data
      return this.processAnalyticsData(events, days)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      return this.getEmptyAnalyticsData()
    }
  }

  private processAnalyticsData(events: any[], days: number): AnalyticsData {
    // Group events by session
    const sessions = new Map()
    events.forEach((event) => {
      if (!sessions.has(event.sessionId)) {
        sessions.set(event.sessionId, [])
      }
      sessions.get(event.sessionId).push(event)
    })

    // Calculate metrics
    const totalSessions = sessions.size
    const avgSessionTime = this.calculateAverageSessionTime(sessions)
    const remindersCreated = events.filter((e) => e.eventType === "reminder_created").length
    const engagementScore = this.calculateEngagementScore(events, sessions)

    // Generate daily activity
    const dailyActivity = this.generateDailyActivity(events, days)

    // Feature usage
    const featureUsage = this.calculateFeatureUsage(events)

    // Hourly pattern
    const hourlyPattern = this.generateHourlyPattern(events)

    // Feature metrics
    const featureMetrics = this.calculateFeatureMetrics(events)

    // Engagement trend
    const engagementTrend = this.generateEngagementTrend(events, days)

    // Top actions
    const topActions = this.calculateTopActions(events)

    // Performance metrics
    const performance = this.calculatePerformanceMetrics(events)

    return {
      overview: {
        totalSessions,
        avgSessionTime,
        remindersCreated,
        engagementScore,
        sessionsChange: 15, // Mock data - would calculate from previous period
        sessionTimeChange: 8,
        remindersChange: 23,
        engagementChange: 12,
      },
      dailyActivity,
      featureUsage,
      hourlyPattern,
      featureMetrics,
      engagementTrend,
      topActions,
      performance,
    }
  }

  private calculateAverageSessionTime(sessions: Map<string, any[]>): string {
    let totalTime = 0
    let validSessions = 0

    sessions.forEach((events) => {
      const sessionStart = events.find((e) => e.eventType === "session_start")
      const sessionEnd = events.find((e) => e.eventType === "session_end")

      if (sessionStart && sessionEnd) {
        const duration = new Date(sessionEnd.timestamp).getTime() - new Date(sessionStart.timestamp).getTime()
        totalTime += duration
        validSessions++
      }
    })

    if (validSessions === 0) return "0m 0s"

    const avgMs = totalTime / validSessions
    const minutes = Math.floor(avgMs / 60000)
    const seconds = Math.floor((avgMs % 60000) / 1000)

    return `${minutes}m ${seconds}s`
  }

  private calculateEngagementScore(events: any[], sessions: Map<string, any[]>): number {
    const interactionEvents = events.filter((e) =>
      ["user_action", "feature_usage", "reminder_created", "quote_generated"].includes(e.eventType),
    )

    const avgInteractionsPerSession = interactionEvents.length / sessions.size
    return Math.min(Math.round(avgInteractionsPerSession * 10), 100)
  }

  private generateDailyActivity(
    events: any[],
    days: number,
  ): Array<{ date: string; sessions: number; reminders: number; quotes: number }> {
    const dailyData = new Map()

    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      dailyData.set(dateStr, { date: dateStr, sessions: 0, reminders: 0, quotes: 0 })
    }

    // Count events by day
    events.forEach((event) => {
      const dateStr = event.timestamp.split("T")[0]
      if (dailyData.has(dateStr)) {
        const day = dailyData.get(dateStr)
        if (event.eventType === "session_start") day.sessions++
        if (event.eventType === "reminder_created") day.reminders++
        if (event.eventType === "quote_generated") day.quotes++
      }
    })

    return Array.from(dailyData.values()).reverse()
  }

  private calculateFeatureUsage(events: any[]): Array<{ name: string; value: number }> {
    const features = new Map()

    events.forEach((event) => {
      if (event.eventType === "feature_usage") {
        const feature = event.eventData.feature
        features.set(feature, (features.get(feature) || 0) + 1)
      }
    })

    return Array.from(features.entries()).map(([name, value]) => ({ name, value }))
  }

  private generateHourlyPattern(events: any[]): Array<{ hour: string; activity: number }> {
    const hourlyData = new Map()

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyData.set(i.toString().padStart(2, "0"), 0)
    }

    // Count events by hour
    events.forEach((event) => {
      const hour = new Date(event.timestamp).getHours().toString().padStart(2, "0")
      hourlyData.set(hour, hourlyData.get(hour) + 1)
    })

    return Array.from(hourlyData.entries()).map(([hour, activity]) => ({ hour, activity }))
  }

  private calculateFeatureMetrics(
    events: any[],
  ): Array<{ name: string; usage: number; change: number; trend: "up" | "down" }> {
    const features = ["Reminders", "Quotes", "Friends", "Sharing"]

    return features.map((feature) => {
      const usage = events.filter(
        (e) => e.eventType === "feature_usage" && e.eventData.feature?.toLowerCase() === feature.toLowerCase(),
      ).length

      return {
        name: feature,
        usage,
        change: Math.floor(Math.random() * 30) - 10, // Mock data
        trend: Math.random() > 0.5 ? "up" : ("down" as "up" | "down"),
      }
    })
  }

  private generateEngagementTrend(events: any[], days: number): Array<{ date: string; score: number }> {
    const dailyEngagement = new Map()

    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      dailyEngagement.set(dateStr, { date: dateStr, interactions: 0, sessions: 0 })
    }

    // Count interactions and sessions by day
    events.forEach((event) => {
      const dateStr = event.timestamp.split("T")[0]
      if (dailyEngagement.has(dateStr)) {
        const day = dailyEngagement.get(dateStr)
        if (event.eventType === "session_start") day.sessions++
        if (["user_action", "feature_usage"].includes(event.eventType)) day.interactions++
      }
    })

    return Array.from(dailyEngagement.values())
      .map((day) => ({
        date: day.date,
        score: day.sessions > 0 ? Math.round((day.interactions / day.sessions) * 10) : 0,
      }))
      .reverse()
  }

  private calculateTopActions(events: any[]): Array<{ name: string; count: number; percentage: number }> {
    const actions = new Map()
    let totalActions = 0

    events.forEach((event) => {
      if (event.eventType === "user_action") {
        const action = event.eventData.action
        actions.set(action, (actions.get(action) || 0) + 1)
        totalActions++
      }
    })

    return Array.from(actions.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalActions) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  private calculatePerformanceMetrics(events: any[]): { pageLoadTime: number; errorRate: number; bounceRate: number } {
    const performanceEvents = events.filter((e) => e.eventType === "performance")
    const errorEvents = events.filter((e) => e.eventType === "error")
    const sessionStarts = events.filter((e) => e.eventType === "session_start")

    const avgLoadTime =
      performanceEvents.length > 0
        ? performanceEvents.reduce((sum, e) => sum + (e.eventData.value || 0), 0) / performanceEvents.length
        : 1200

    const errorRate = sessionStarts.length > 0 ? (errorEvents.length / sessionStarts.length) * 100 : 0

    const bounceRate = 25 // Mock data - would calculate from actual session data

    return {
      pageLoadTime: Math.round(avgLoadTime),
      errorRate: Math.round(errorRate * 100) / 100,
      bounceRate,
    }
  }

  private getEmptyAnalyticsData(): AnalyticsData {
    return {
      overview: {
        totalSessions: 0,
        avgSessionTime: "0m 0s",
        remindersCreated: 0,
        engagementScore: 0,
        sessionsChange: 0,
        sessionTimeChange: 0,
        remindersChange: 0,
        engagementChange: 0,
      },
      dailyActivity: [],
      featureUsage: [],
      hourlyPattern: [],
      featureMetrics: [],
      engagementTrend: [],
      topActions: [],
      performance: {
        pageLoadTime: 0,
        errorRate: 0,
        bounceRate: 0,
      },
    }
  }

  async exportAnalyticsData(userId: string, timeRange: "7d" | "30d" | "90d"): Promise<void> {
    try {
      const data = await this.getAnalyticsData(userId, timeRange)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `mindreminder-analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting analytics data:", error)
    }
  }
}
