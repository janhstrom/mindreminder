"use client"

import { useEffect, useState } from "react"
import { getAnalyticsService, type AnalyticsData } from "@/lib/analytics-service"

export function useAnalytics() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const service = getAnalyticsService()
    setIsReady(!!service)
  }, [])

  const trackEvent = (eventType: string, eventData?: Record<string, any>, userId?: string) => {
    const service = getAnalyticsService()
    service?.trackEvent(eventType, eventData, userId)
  }

  const trackPageView = (page: string, userId?: string) => {
    const service = getAnalyticsService()
    service?.trackPageView(page, userId)
  }

  const trackUserAction = (action: string, details?: Record<string, any>, userId?: string) => {
    const service = getAnalyticsService()
    service?.trackUserAction(action, details, userId)
  }

  const trackFeatureUsage = (feature: string, details?: Record<string, any>, userId?: string) => {
    const service = getAnalyticsService()
    service?.trackFeatureUsage(feature, details, userId)
  }

  return {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackFeatureUsage,
    isReady,
  }
}

export function useAnalyticsData(userId: string, timeRange: "7d" | "30d" | "90d") {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const analytics = getAnalyticsService()
        if (analytics) {
          const analyticsData = await analytics.getAnalyticsData(userId, timeRange)
          setData(analyticsData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch analytics data")
      } finally {
        setLoading(false)
      }
    }

    if (userId && typeof window !== "undefined") {
      fetchData()
    }
  }, [userId, timeRange])

  return { data, loading, error }
}
