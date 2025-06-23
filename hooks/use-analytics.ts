"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Analytics } from "@/lib/analytics"

export function useAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Only track page views on client side
    if (typeof window !== "undefined") {
      Analytics.pageView(pathname)
    }
  }, [pathname])

  return Analytics
}

// Custom hook for tracking user interactions
export function useTrackEvent() {
  return {
    trackClick: (buttonName: string, location: string) => {
      Analytics.trackButtonClick(buttonName, location)
    },
    trackFeature: (featureName: string) => {
      Analytics.trackFeatureUsage(featureName)
    },
    trackError: (errorType: string, message: string) => {
      Analytics.trackError(errorType, message)
    },
  }
}
