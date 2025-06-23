"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Globe, Calendar } from "lucide-react"
import { UserPreferencesService, type UserPreferences } from "@/lib/user-preferences"
import { Analytics } from "@/lib/analytics"

export function UserPreferencesCard() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h",
    timezone: "UTC",
    language: "en",
  })
  const [hasChanges, setHasChanges] = useState(false)

  const preferencesService = UserPreferencesService.getInstance()

  useEffect(() => {
    setPreferences(preferencesService.getPreferences())
  }, [])

  const handlePreferenceChange = (key: keyof UserPreferences, value: string) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    setHasChanges(true)
  }

  const handleSave = () => {
    preferencesService.savePreferences(preferences)
    setHasChanges(false)

    Analytics.event("user_preferences_updated", {
      date_format: preferences.dateFormat,
      time_format: preferences.timeFormat,
      timezone: preferences.timezone,
      event_category: "settings",
    })
  }

  const handleReset = () => {
    const defaultPrefs = preferencesService.getPreferences()
    setPreferences(defaultPrefs)
    setHasChanges(false)
  }

  // Example date for preview
  const exampleDate = new Date()
  const formattedExample = preferencesService.formatDateTime(exampleDate)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Date & Time Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Date Format */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Format
            </Label>
            <Select
              value={preferences.dateFormat}
              onValueChange={(value) => handlePreferenceChange("dateFormat", value as UserPreferences["dateFormat"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/dd/yyyy">MM/dd/yyyy (US)</SelectItem>
                <SelectItem value="dd/MM/yyyy">dd/MM/yyyy (UK/EU)</SelectItem>
                <SelectItem value="yyyy-MM-dd">yyyy-MM-dd (ISO)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Format */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Format
            </Label>
            <Select
              value={preferences.timeFormat}
              onValueChange={(value) => handlePreferenceChange("timeFormat", value as UserPreferences["timeFormat"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange("timezone", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {preferencesService.getTimezones().map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preview */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <Label className="text-sm font-medium">Preview</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Current date and time: <span className="font-mono">{formattedExample}</span>
          </p>
        </div>

        {/* Actions */}
        {hasChanges && (
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave}>Save Changes</Button>
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
