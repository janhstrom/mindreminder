"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Notifications</CardTitle>
          <CardDescription>Configure how you receive notifications from MindReMinder</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications_enabled">Enable Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications for reminders and updates</p>
            </div>
            <Switch
              id="notifications_enabled"
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => onSettingsChange({ notifications_enabled: checked })}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              id="email_notifications"
              checked={settings.email_notifications}
              onCheckedChange={(checked) => onSettingsChange({ email_notifications: checked })}
              disabled={loading || !settings.notifications_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push_notifications">Push Notifications</Label>
              <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
            </div>
            <Switch
              id="push_notifications"
              checked={settings.push_notifications}
              onCheckedChange={(checked) => onSettingsChange({ push_notifications: checked })}
              disabled={loading || !settings.notifications_enabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Settings</CardTitle>
          <CardDescription>Customize how reminders are delivered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminder_sound">Reminder Sound</Label>
              <p className="text-sm text-gray-500">Play a sound when reminders are triggered</p>
            </div>
            <Switch
              id="reminder_sound"
              checked={settings.reminder_sound}
              onCheckedChange={(checked) => onSettingsChange({ reminder_sound: checked })}
              disabled={loading || !settings.notifications_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="daily_summary">Daily Summary</Label>
              <p className="text-sm text-gray-500">Receive a daily summary of your progress</p>
            </div>
            <Switch
              id="daily_summary"
              checked={settings.daily_summary}
              onCheckedChange={(checked) => onSettingsChange({ daily_summary: checked })}
              disabled={loading || !settings.notifications_enabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
