"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Cookie } from "lucide-react"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowConsent(false)
    // Enable Google Analytics
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
    })
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShowConsent(false)
    // Disable Google Analytics
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
    })
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cookie className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Cookie Consent</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDecline}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription>
            We use cookies and analytics to improve your experience and understand how you use MindReMinder. Your
            privacy is important to us.
          </CardDescription>
          <div className="flex space-x-2">
            <Button onClick={handleAccept} size="sm" className="flex-1">
              Accept
            </Button>
            <Button onClick={handleDecline} variant="outline" size="sm" className="flex-1">
              Decline
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            <a href="/privacy" className="underline hover:no-underline">
              Learn more about our privacy policy
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
