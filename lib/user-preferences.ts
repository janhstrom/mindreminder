"use client"

export interface UserPreferences {
  dateFormat: "MM/dd/yyyy" | "dd/MM/yyyy" | "yyyy-MM-dd"
  timeFormat: "12h" | "24h"
  timezone: string
  language: string
}

export class UserPreferencesService {
  private static instance: UserPreferencesService

  static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService()
    }
    return UserPreferencesService.instance
  }

  getPreferences(): UserPreferences {
    if (typeof window === "undefined") {
      return this.getDefaultPreferences()
    }

    const stored = localStorage.getItem("user-preferences")
    if (stored) {
      return { ...this.getDefaultPreferences(), ...JSON.parse(stored) }
    }

    return this.getDefaultPreferences()
  }

  savePreferences(preferences: UserPreferences): void {
    if (typeof window === "undefined") return
    localStorage.setItem("user-preferences", JSON.stringify(preferences))
  }

  private getDefaultPreferences(): UserPreferences {
    // Detect user's locale preferences
    const locale = typeof window !== "undefined" ? navigator.language : "en-US"
    const timezone = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"

    // Determine date format based on locale
    let dateFormat: UserPreferences["dateFormat"] = "MM/dd/yyyy"
    if (locale.startsWith("en-GB") || locale.startsWith("en-AU") || locale.includes("EU")) {
      dateFormat = "dd/MM/yyyy"
    } else if (locale.startsWith("ja") || locale.startsWith("ko") || locale.startsWith("zh")) {
      dateFormat = "yyyy-MM-dd"
    }

    // Determine time format based on locale
    const timeFormat: UserPreferences["timeFormat"] = locale.startsWith("en-US") ? "12h" : "24h"

    return {
      dateFormat,
      timeFormat,
      timezone,
      language: locale.split("-")[0] || "en",
    }
  }

  formatDate(date: Date): string {
    if (typeof window === "undefined") {
      return date.toLocaleDateString()
    }

    const preferences = this.getPreferences()
    const options: Intl.DateTimeFormatOptions = {
      timeZone: preferences.timezone,
    }

    switch (preferences.dateFormat) {
      case "MM/dd/yyyy":
        return date.toLocaleDateString("en-US", options)
      case "dd/MM/yyyy":
        return date.toLocaleDateString("en-GB", options)
      case "yyyy-MM-dd":
        return date.toLocaleDateString("sv-SE", options)
      default:
        return date.toLocaleDateString(undefined, options)
    }
  }

  formatTime(date: Date): string {
    if (typeof window === "undefined") {
      return date.toLocaleTimeString()
    }

    const preferences = this.getPreferences()
    const options: Intl.DateTimeFormatOptions = {
      timeZone: preferences.timezone,
      hour12: preferences.timeFormat === "12h",
      hour: "2-digit",
      minute: "2-digit",
    }

    return date.toLocaleTimeString(undefined, options)
  }

  formatDateTime(date: Date): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`
  }

  getTimezones(): string[] {
    // Common timezones - in a real app, you might want a more comprehensive list
    return [
      "UTC",
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Toronto",
      "America/Vancouver",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Rome",
      "Europe/Madrid",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Asia/Kolkata",
      "Asia/Dubai",
      "Australia/Sydney",
      "Australia/Melbourne",
      "Pacific/Auckland",
    ]
  }
}
