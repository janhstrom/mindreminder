"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Bell, Mail, Smartphone, Volume2, FileText } from "lucide-react"

interface UserSettings {
  id: string
  theme: string
  notifications_enabled: boolean
  email_notifications: boolean
  push_notifications: boolean
  reminder_sound: boolean
  daily_summary: boolean
  timezone: string
  language: string
  date_format: string
  time_format: string
  created_at: string
  updated_at: string
}

interface NotificationSettingsProps {
  settings: UserSettings
  onSettingsChange: (settings: Partial<UserSettings>) => void
  loading: boolean
}

export function NotificationSettings({ settings, onSettingsChange, loading }: NotificationSettingsProps) {
  const handleSave = () => {
    // Settings are automatically saved when changed
    console.log("Notification settings saved")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            General Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications-enabled">Enable Notifications</Label>
              <p className="text-sm text-gray-500">Master switch for all notifications</p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => onSettingsChange({ notifications_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminder-sound" className="flex items-center">
                <Volume2 className="h-4 w-4 mr-2" />
                Reminder Sound
              </Label>
              <p className="text-sm text-gray-500">Play sound when reminders are triggered</p>
            </div>
            <Switch
              id="reminder-sound"
              checked={settings.reminder_sound}
              onCheckedChange={(checked) => onSettingsChange({ reminder_sound: checked })}
              disabled={!settings.notifications_enabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.email_notifications}
              onCheckedChange={(checked) => onSettingsChange({ email_notifications: checked })}
              disabled={!settings.notifications_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="daily-summary" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Daily Summary
              </Label>
              <p className="text-sm text-gray-500">Receive a daily summary of your progress</p>
            </div>
            <Switch
              id="daily-summary"
              checked={settings.daily_summary}
              onCheckedChange={(checked) => onSettingsChange({ daily_summary: checked })}
              disabled={!settings.notifications_enabled || !settings.email_notifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-gray-500">Receive push notifications on your device</p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.push_notifications}
              onCheckedChange={(checked) => onSettingsChange({ push_notifications: checked })}
              disabled={!settings.notifications_enabled}
            />
          </div>

          {settings.push_notifications && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Push notifications require browser permission. You may be prompted to allow
                notifications.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
