"use client"

import type React from "react"
import { useEffect } from "react"

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Initialize Google Analytics
    const initGA = () => {
      // Google Analytics 4
      const script = document.createElement("script")
      script.async = true
      script.src = "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
      document.head.appendChild(script)

      script.onload = () => {
        window.dataLayer = window.dataLayer || []
        function gtag(...args: any[]) {
          window.dataLayer.push(args)
        }
        window.gtag = gtag

        gtag("js", new Date())
        gtag("config", "GA_MEASUREMENT_ID", {
          page_title: document.title,
          page_location: window.location.href,
        })
      }
    }

    // Initialize analytics after a short delay to ensure DOM is ready
    const timer = setTimeout(initGA, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return <>{children}</>
}
