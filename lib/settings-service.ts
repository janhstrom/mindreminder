"use client"

import { supabase } from "./supabase"
import { UserService } from "./dashboard-data"

export interface UserSettings {
  // Notifications
  pushEnabled: boolean
  emailEnabled: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  quietHours: boolean
  quietStart: string
  quietEnd: string

  // Profile
  firstName: string
  lastName: string
  email: string
  timezone: string
  bio: string

  // Preferences
  theme: string
  language: string
  reminderStyle: string
  defaultReminderTime: string
  weekStartsOn: string
}

export class SettingsService {
  static async getSettings(userId?: string): Promise<UserSettings> {
    try {
      const actualUserId = userId || (await UserService.ensureDemoUser())

      // Get user profile
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", actualUserId).single()

      // Get user settings (we'll create this table)
      const { data: settings } = await supabase.from("user_settings").select("*").eq("user_id", actualUserId).single()

      return {
        // Notifications
        pushEnabled: settings?.push_enabled ?? true,
        emailEnabled: settings?.email_enabled ?? false,
        soundEnabled: settings?.sound_enabled ?? true,
        vibrationEnabled: settings?.vibration_enabled ?? true,
        quietHours: settings?.quiet_hours ?? false,
        quietStart: settings?.quiet_start ?? "22:00",
        quietEnd: settings?.quiet_end ?? "08:00",

        // Profile
        firstName: profile?.first_name ?? "Demo",
        lastName: profile?.last_name ?? "User",
        email: profile?.email ?? "demo@mindreminder.com",
        timezone: settings?.timezone ?? "America/New_York",
        bio: profile?.bio ?? "Building better habits one micro-action at a time!",

        // Preferences
        theme: settings?.theme ?? "system",
        language: settings?.language ?? "en",
        reminderStyle: settings?.reminder_style ?? "gentle",
        defaultReminderTime: settings?.default_reminder_time ?? "09:00",
        weekStartsOn: settings?.week_starts_on ?? "monday",
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      // Return defaults if error
      return {
        pushEnabled: true,
        emailEnabled: false,
        soundEnabled: true,
        vibrationEnabled: true,
        quietHours: false,
        quietStart: "22:00",
        quietEnd: "08:00",
        firstName: "Demo",
        lastName: "User",
        email: "demo@mindreminder.com",
        timezone: "America/New_York",
        bio: "Building better habits one micro-action at a time!",
        theme: "system",
        language: "en",
        reminderStyle: "gentle",
        defaultReminderTime: "09:00",
        weekStartsOn: "monday",
      }
    }
  }

  static async saveSettings(settings: UserSettings, userId?: string): Promise<void> {
    try {
      const actualUserId = userId || (await UserService.ensureDemoUser())

      // Update profile
      await supabase.from("profiles").upsert({
        id: actualUserId,
        email: settings.email,
        first_name: settings.firstName,
        last_name: settings.lastName,
        bio: settings.bio,
      })

      // Update settings
      await supabase.from("user_settings").upsert({
        user_id: actualUserId,
        push_enabled: settings.pushEnabled,
        email_enabled: settings.emailEnabled,
        sound_enabled: settings.soundEnabled,
        vibration_enabled: settings.vibrationEnabled,
        quiet_hours: settings.quietHours,
        quiet_start: settings.quietStart,
        quiet_end: settings.quietEnd,
        timezone: settings.timezone,
        theme: settings.theme,
        language: settings.language,
        reminder_style: settings.reminderStyle,
        default_reminder_time: settings.defaultReminderTime,
        week_starts_on: settings.weekStartsOn,
      })

      console.log("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      throw error
    }
  }
}
