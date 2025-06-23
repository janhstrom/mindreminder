"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { getAnalyticsService } from "@/lib/analytics-service"
import { AnalyticsProvider } from "./analytics-provider"

interface EnhancedAnalyticsProviderProps {
  children: React.ReactNode
}

export function EnhancedAnalyticsProvider({ children }: EnhancedAnalyticsProviderProps) {
  const pathname = usePathname()
  const analyticsService = getAnalyticsService()

  useEffect(() => {
    // Initialize analytics only on client side
    if (analyticsService) {
      // Analytics is now initialized
      console.log("Analytics initialized")
    }
  }, [])

  useEffect(() => {
    // Track page views
    if (analyticsService) {
      analyticsService.trackPageView(pathname)
    }
  }, [pathname])

  useEffect(() => {
    // Track performance metrics
    const trackPerformance = () => {
      // Page load time
      if (typeof window !== "undefined" && window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
        if (loadTime > 0 && analyticsService) {
          analyticsService.trackPerformance("page_load_time", loadTime)
        }
      }

      // Core Web Vitals
      if ("web-vital" in window) {
        // This would integrate with web-vitals library
        // getCLS, getFID, getFCP, getLCP, getTTFB
      }
    }

    // Track after page load
    if (document.readyState === "complete") {
      trackPerformance()
    } else {
      window.addEventListener("load", trackPerformance)
    }

    // Track errors
    const handleError = (event: ErrorEvent) => {
      if (analyticsService) {
        analyticsService.trackError("javascript_error", {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        })
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (analyticsService) {
        analyticsService.trackError("unhandled_promise_rejection", {
          reason: event.reason?.toString(),
        })
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("load", trackPerformance)
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return <AnalyticsProvider>{children}</AnalyticsProvider>
}
