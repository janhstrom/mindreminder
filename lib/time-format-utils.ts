"use client"

import { SettingsService } from "./settings-service"

export class TimeFormatUtils {
  private static settings: any = null

  static async getSettings() {
    if (!this.settings) {
      try {
        this.settings = await SettingsService.getSettings()
      } catch (error) {
        console.error("Error loading settings for time format:", error)
        // Fallback to defaults
        this.settings = {
          timeFormat: "12h",
          dateFormat: "MM/dd/yyyy",
        }
      }
    }
    return this.settings
  }

  static async formatTime(time: string): Promise<string> {
    const settings = await this.getSettings()

    if (!time) return ""

    try {
      // Parse the time (assuming HH:mm format from input)
      const [hours, minutes] = time.split(":").map(Number)

      if (settings.timeFormat === "12h") {
        const period = hours >= 12 ? "PM" : "AM"
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
      } else {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
      }
    } catch (error) {
      console.error("Error formatting time:", error)
      return time // Return original if formatting fails
    }
  }

  static async formatDateTime(dateTime: string | Date): Promise<string> {
    const settings = await this.getSettings()

    if (!dateTime) return ""

    try {
      const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime

      // Format date part
      let dateStr = ""
      switch (settings.dateFormat) {
        case "MM/dd/yyyy":
          dateStr = date.toLocaleDateString("en-US")
          break
        case "dd/MM/yyyy":
          dateStr = date.toLocaleDateString("en-GB")
          break
        case "yyyy-MM-dd":
          dateStr = date.toLocaleDateString("sv-SE")
          break
        default:
          dateStr = date.toLocaleDateString()
      }

      // Format time part
      const timeStr = await this.formatTime(`${date.getHours()}:${date.getMinutes()}`)

      return `${dateStr} ${timeStr}`
    } catch (error) {
      console.error("Error formatting datetime:", error)
      return dateTime.toString()
    }
  }

  static convertTo24Hour(time12h: string): string {
    try {
      const [time, period] = time12h.split(" ")
      const [hours, minutes] = time.split(":").map(Number)

      let hours24 = hours
      if (period === "PM" && hours !== 12) {
        hours24 += 12
      } else if (period === "AM" && hours === 12) {
        hours24 = 0
      }

      return `${hours24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    } catch (error) {
      console.error("Error converting to 24h:", error)
      return time12h
    }
  }

  static convertTo12Hour(time24h: string): string {
    try {
      const [hours, minutes] = time24h.split(":").map(Number)
      const period = hours >= 12 ? "PM" : "AM"
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
    } catch (error) {
      console.error("Error converting to 12h:", error)
      return time24h
    }
  }
}
