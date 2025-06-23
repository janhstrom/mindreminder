"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackPageView, trackPerformance, trackError } from "@/lib/analytics-service"
import { AnalyticsProvider } from "./analytics-provider"

interface EnhancedAnalyticsProviderProps {
  children: React.ReactNode
}

export function EnhancedAnalyticsProvider({ children }: EnhancedAnalyticsProviderProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views
    trackPageView(pathname)
  }, [pathname])

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Track performance metrics
    const trackPerformanceMetrics = () => {
      // Page load time
      if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
        if (loadTime > 0) {
          trackPerformance("page_load_time", loadTime)
        }
      }
    }

    // Track after page load
    if (document.readyState === "complete") {
      trackPerformanceMetrics()
    } else {
      window.addEventListener("load", trackPerformanceMetrics)
    }

    // Track errors
    const handleError = (event: ErrorEvent) => {
      trackError("javascript_error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError("unhandled_promise_rejection", {
        reason: event.reason?.toString(),
      })
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("load", trackPerformanceMetrics)
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return <AnalyticsProvider>{children}</AnalyticsProvider>
}
