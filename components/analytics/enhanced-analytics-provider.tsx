"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { AnalyticsService } from "@/lib/analytics-service"
import { AnalyticsProvider } from "./analytics-provider"
import type { AuthUser } from "@/lib/auth-supabase"

interface EnhancedAnalyticsProviderProps {
  children: React.ReactNode
  user?: AuthUser | null
}

export function EnhancedAnalyticsProvider({ children, user }: EnhancedAnalyticsProviderProps) {
  const pathname = usePathname()
  const analyticsService = AnalyticsService.getInstance()

  useEffect(() => {
    // Track page views
    analyticsService.trackPageView(pathname, user?.id)
  }, [pathname, user?.id])

  useEffect(() => {
    // Track performance metrics
    const trackPerformance = () => {
      // Page load time
      if (typeof window !== "undefined" && window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
        if (loadTime > 0) {
          analyticsService.trackPerformance("page_load_time", loadTime, user?.id)
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
      analyticsService.trackError(
        "javascript_error",
        {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        },
        user?.id,
      )
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analyticsService.trackError(
        "unhandled_promise_rejection",
        {
          reason: event.reason?.toString(),
        },
        user?.id,
      )
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("load", trackPerformance)
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [user?.id])

  return <AnalyticsProvider>{children}</AnalyticsProvider>
}
