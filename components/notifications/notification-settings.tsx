"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, BellOff, TestTube, CheckCircle, AlertCircle, Volume2, Vibrate, ExternalLink, HelpCircle } from 'lucide-react'
import { NotificationService, type NotificationSettings } from "@/lib/notifications"
import { getBrowserInfo, openBrowserSettings } from "@/lib/browser-settings"
import { Analytics } from "@/lib/analytics"

export function NotificationSettingsCard() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    reminders: true,
    quotes: false,
    location: true,
    sound: true,
    vibrate: true,
  })
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const notificationService = NotificationService.getInstance()
  const browserInfo = getBrowserInfo()

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await notificationService.initialize()
      setIsSupported(supported)

      if (supported) {
        setPermission(Notification.permission)
        setSettings(notificationService.getNotificationSettings())
      }
    }

    checkSupport()
  }, [])

  const handleRequestPermission = async () => {
    setIsLoading(true)
    try {
      const newPermission = await notificationService.requestPermission()
      setPermission(newPermission)

      if (newPermission === "granted") {
        setSettings((prev) => ({ ...prev, enabled: true }))
        Analytics.event("notification_permission_granted", {
          event_category: "notifications",
        })
      }
    } catch (error) {
      console.error("Error requesting permission:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    notificationService.saveNotificationSettings(newSettings)

    Analytics.event("notification_setting_changed", {
      setting: key,
      value: value.toString(),
      event_category: "notifications",
    })
  }

  const handleTestNotification = async () => {
    if (permission !== "granted") return

    try {
      await notificationService.showTestNotification()
      setTestSent(true)
      setTimeout(() => setTestSent(false), 3000)

      Analytics.event("test_notification_sent", {
        event_category: "notifications",
      })
    } catch (error) {
      console.error("Error sending test notification:", error)
    }
  }

  const handleOpenBrowserSettings = () => {
    openBrowserSettings()
    Analytics.event("browser_settings_opened", {
      browser: browserInfo.name,
      event_category: "notifications",
    })
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Push notifications are not supported in your browser.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
          {permission === "granted" && settings.enabled && (
            <Badge variant="secondary" className="ml-auto">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Status */}
        <div className="space-y-4">
          {permission === "default" && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm mb-3">
                Enable push notifications to receive reminders even when MindReMinder isn't open.
              </p>
              <Button onClick={handleRequestPermission} disabled={isLoading}>
                {isLoading ? "Requesting..." : "Enable Notifications"}
              </Button>
            </div>
          )}

          {permission === "denied" && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-3">
                <p className="text-destructive">
                  Notifications are blocked. Please enable them in your browser settings to receive reminders.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {browserInfo.settingsUrl && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleOpenBrowserSettings}
                      className="text-destructive border-destructive/50 hover:bg-destructive/10"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open {browserInfo.name} Settings
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowHelp(!showHelp)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <HelpCircle className="h-3 w-3 mr-1" />
                    Show Instructions
                  </Button>
                </div>

                {showHelp && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm font-medium mb-2">How to enable notifications in {browserInfo.name}:</p>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      {browserInfo.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {permission === "granted" && (
            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Notifications are enabled! You'll receive reminders as push notifications.
                </p>
                <Button size="sm" variant="outline" onClick={handleTestNotification} disabled={!settings.enabled}>
                  {testSent ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Sent!
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-1" />
                      Test
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        {permission === "granted" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Master switch for all push notifications</p>
              </div>
              <Switch
                id="notifications-enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange("enabled", checked)}
              />
            </div>

            {settings.enabled && (
              <>
                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder-notifications">Reminder Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your scheduled reminders are due
                      </p>
                    </div>
                    <Switch
                      id="reminder-notifications"
                      checked={settings.reminders}
                      onCheckedChange={(checked) => handleSettingChange("reminders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="quote-notifications">Daily Quotes</Label>
                      <p className="text-sm text-muted-foreground">Receive daily inspirational quotes (9 AM)</p>
                    </div>
                    <Switch
                      id="quote-notifications"
                      checked={settings.quotes}
                      onCheckedChange={(checked) => handleSettingChange("quotes", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="location-notifications">Location Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you arrive at reminder locations
                      </p>
                    </div>
                    <Switch
                      id="location-notifications"
                      checked={settings.location}
                      onCheckedChange={(checked) => handleSettingChange("location", checked)}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-medium">Notification Style</h4>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-y-0.5">
                      <Volume2 className="h-4 w-4 mr-2" />
                      <Label htmlFor="sound-notifications">Sound</Label>
                    </div>
                    <Switch
                      id="sound-notifications"
                      checked={settings.sound}
                      onCheckedChange={(checked) => handleSettingChange("sound", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-y-0.5">
                      <Vibrate className="h-4 w-4 mr-2" />
                      <Label htmlFor="vibrate-notifications">Vibration</Label>
                    </div>
                    <Switch
                      id="vibrate-notifications"
                      checked={settings.vibrate}
                      onCheckedChange={(checked) => handleSettingChange("vibrate", checked)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Notifications work even when the browser tab is closed</p>
          <p>• Location reminders require location permission</p>
          <p>• You can disable notifications anytime in browser settings</p>
        </div>
      </CardContent>
    </Card>
  )
}
