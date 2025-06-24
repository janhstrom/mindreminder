"use client"

import { useState, useEffect } from "react"
import { SettingsService } from "@/lib/settings-service"

interface DateTimeSettings {
  dateFormat: "MM/dd/yyyy" | "dd/MM/yyyy" | "yyyy-MM-dd"
  timeFormat: "12h" | "24h"
}

export function useDateTimeFormat() {
  const [settings, setSettings] = useState<DateTimeSettings>({
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const userSettings = await SettingsService.getSettings()
      setSettings({
        dateFormat: userSettings.dateFormat || "MM/dd/yyyy",
        timeFormat: userSettings.timeFormat || "12h",
      })
    } catch (error) {
      console.error("Error loading date/time settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string | Date): string => {
    if (!date) return ""

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date

      switch (settings.dateFormat) {
        case "MM/dd/yyyy":
          return dateObj.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })
        case "dd/MM/yyyy":
          return dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        case "yyyy-MM-dd":
          return dateObj.toLocaleDateString("sv-SE")
        default:
          return dateObj.toLocaleDateString()
      }
    } catch (error) {
      console.error("Error formatting date:", error)
      return date.toString()
    }
  }

  const formatTime = (time: string | Date): string => {
    if (!time) return ""

    try {
      let dateObj: Date

      if (typeof time === "string") {
        // Handle different time string formats
        if (time.includes("T")) {
          dateObj = new Date(time)
        } else if (time.includes(":")) {
          // Handle HH:mm format
          const [hours, minutes] = time.split(":").map(Number)
          dateObj = new Date()
          dateObj.setHours(hours, minutes, 0, 0)
        } else {
          dateObj = new Date(time)
        }
      } else {
        dateObj = time
      }

      if (settings.timeFormat === "12h") {
        return dateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      } else {
        return dateObj.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      }
    } catch (error) {
      console.error("Error formatting time:", error)
      return time.toString()
    }
  }

  const formatDateTime = (dateTime: string | Date): string => {
    if (!dateTime) return ""

    try {
      const dateObj = typeof dateTime === "string" ? new Date(dateTime) : dateTime
      return `${formatDate(dateObj)} ${formatTime(dateObj)}`
    } catch (error) {
      console.error("Error formatting datetime:", error)
      return dateTime.toString()
    }
  }

  return {
    settings,
    loading,
    formatDate,
    formatTime,
    formatDateTime,
    refreshSettings: loadSettings,
  }
}
