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
  const [isMounted, setIsMounted] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h",
    timezone: "UTC",
    language: "en",
  })
  const [hasChanges, setHasChanges] = useState(false)

  // Memoize the service instance if it were more complex, but for a singleton, direct use is fine.
  const preferencesService = UserPreferencesService.getInstance()

  useEffect(() => {
    // Initialize preferences from service once mounted
    // The service itself handles localStorage, so this runs client-side.
    setPreferences(preferencesService.getPreferences())
  }, [preferencesService]) // Depend on preferencesService instance

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handlePreferenceChange = (key: keyof UserPreferences, value: string) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    setHasChanges(true)
  }

  const handleSave = () => {
    preferencesService.savePreferences(preferences)
    setHasChanges(false)

    // Example of analytics event
    Analytics.event("user_preferences_updated", {
      date_format: preferences.dateFormat,
      time_format: preferences.timeFormat,
      timezone: preferences.timezone,
      event_category: "settings",
      // language: preferences.language, // Consider adding if tracked
    })
    // Optionally, show a toast notification for success
  }

  const handleReset = () => {
    // To reset, we get the current state which might be influenced by system defaults via getPreferences()
    // If you wanted a hardcoded default, you'd define it elsewhere.
    const defaultPrefs = preferencesService.getPreferences() // This re-reads from localStorage or system defaults
    setPreferences(defaultPrefs)
    // If resetting should clear localStorage and truly go back to initial system-derived defaults:
    // const initialDefaults = preferencesService.getDefaultPreferences(); // Assuming you add this method to service
    // setPreferences(initialDefaults);
    // preferencesService.savePreferences(initialDefaults);
    setHasChanges(false)
  }

  // Ensure preferences object exists before trying to format
  const exampleDate = new Date()
  const formattedExample = preferences ? preferencesService.formatDateTime(exampleDate, preferences) : "Loading..."

  if (!isMounted) {
    // Skeleton loader to prevent hydration mismatch and improve UX
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Date & Time Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="h-8 w-1/2 bg-muted rounded-md animate-pulse" />
          <div className="h-8 w-3/4 bg-muted rounded-md animate-pulse" />
          <div className="h-8 w-full bg-muted rounded-md animate-pulse" />
        </CardContent>
      </Card>
    )
  }

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
            <Label htmlFor="dateFormat" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Format
            </Label>
            <Select
              value={preferences.dateFormat}
              onValueChange={(value) => handlePreferenceChange("dateFormat", value as UserPreferences["dateFormat"])}
              name="dateFormat"
              aria-label="Date Format"
            >
              <SelectTrigger id="dateFormat">
                <SelectValue placeholder="Select date format" />
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
            <Label htmlFor="timeFormat" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Format
            </Label>
            <Select
              value={preferences.timeFormat}
              onValueChange={(value) => handlePreferenceChange("timeFormat", value as UserPreferences["timeFormat"])}
              name="timeFormat"
              aria-label="Time Format"
            >
              <SelectTrigger id="timeFormat">
                <SelectValue placeholder="Select time format" />
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
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={preferences.timezone}
            onValueChange={(value) => handlePreferenceChange("timezone", value)}
            name="timezone"
            aria-label="Timezone"
          >
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select timezone" />
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

        {/* Language - Assuming this is part of UserPreferences and Service
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={preferences.language}
            onValueChange={(value) => handlePreferenceChange("language", value)}
            name="language"
            aria-label="Language"
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              // Add other languages as needed
            </SelectContent>
          </Select>
        </div>
        */}

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
