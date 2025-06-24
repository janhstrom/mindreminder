"use client"

import { supabase } from "./supabase"

export interface UserSettings {
  // Notifications
  pushEnabled: boolean
  emailEnabled: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  quietHours: boolean
  quietStart?: string // Optional
  quietEnd?: string // Optional

  // Profile (these are primarily from 'profiles' table but included for a unified settings object)
  firstName: string
  lastName: string
  email: string // User's email, usually from auth
  timezone: string
  bio: string

  // Preferences
  theme: string
  language: string
  reminderStyle: string
  defaultReminderTime?: string // Optional
  weekStartsOn: string
  dateFormat: string
  timeFormat: string
}

// DEFAULT_SETTINGS_VALUES omits the time fields that are now optional
const DEFAULT_SETTINGS_VALUES: Omit<
  UserSettings,
  "firstName" | "lastName" | "email" | "bio" | "quietStart" | "quietEnd" | "defaultReminderTime"
> = {
  pushEnabled: true,
  emailEnabled: false,
  soundEnabled: true,
  vibrationEnabled: true,
  quietHours: false,
  // quietStart, quietEnd, defaultReminderTime are intentionally omitted here
  timezone: "America/New_York",
  theme: "system",
  language: "en",
  reminderStyle: "gentle",
  weekStartsOn: "monday",
  dateFormat: "MM/dd/yyyy",
  timeFormat: "12h",
}

export class SettingsService {
  private static async getProfileData(userId: string): Promise<Partial<UserSettings>> {
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, email, bio")
      .eq("id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile data for settings:", error)
    }
    return {
      firstName: data?.first_name ?? "User",
      lastName: data?.last_name ?? "",
      email: data?.email ?? "",
      bio: data?.bio ?? "",
    }
  }

  static async getSettings(userId: string): Promise<UserSettings> {
    try {
      const profileInfo = await this.getProfileData(userId)

      const { data: settingsData, error: settingsError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle()

      if (settingsError) {
        console.error("Error fetching user_settings from Supabase:", settingsError)
        throw settingsError
      }

      if (settingsData) {
        return {
          ...DEFAULT_SETTINGS_VALUES,
          ...profileInfo,
          email: profileInfo.email || "user@example.com",
          ...settingsData,
          user_id: undefined,
        } as UserSettings
      } else {
        console.log(`No settings found for user ${userId}. Creating default settings.`)
        const defaultSettingsForUser: UserSettings = {
          ...DEFAULT_SETTINGS_VALUES, // This will not include the time fields
          ...profileInfo,
          email: profileInfo.email || "user@example.com",
          // quietStart, quietEnd, defaultReminderTime will be undefined here
        }
        await this.saveSettings(defaultSettingsForUser, userId, true)
        return defaultSettingsForUser
      }
    } catch (error) {
      console.error("Critical error in SettingsService.getSettings, returning hardcoded defaults:", error)
      const profileDefaults = { firstName: "User", lastName: "", email: "user@example.com", bio: "" }
      return {
        ...DEFAULT_SETTINGS_VALUES,
        ...profileDefaults,
        // Time fields will be undefined here as well
      }
    }
  }

  static async saveSettings(settings: UserSettings, userId: string, isInitialSave = false): Promise<void> {
    try {
      const profileUpdates = {
        first_name: settings.firstName,
        last_name: settings.lastName,
        bio: settings.bio,
        // email is not updated here to avoid conflict with auth.users.email
      }
      const { error: profileError } = await supabase.from("profiles").update(profileUpdates).eq("id", userId)

      if (profileError) {
        console.error("Error updating profile:", profileError)
      }

      // Prepare user_settings data. Optional time fields will be omitted by Supabase client if undefined.
      const userSettingsDataSnakeCase = {
        user_id: userId,
        push_enabled: settings.pushEnabled,
        email_enabled: settings.emailEnabled,
        sound_enabled: settings.soundEnabled,
        vibration_enabled: settings.vibrationEnabled,
        quiet_hours: settings.quietHours,
        quiet_start: settings.quietStart, // Will be undefined on initial save
        quiet_end: settings.quietEnd, // Will be undefined on initial save
        timezone: settings.timezone,
        theme: settings.theme,
        language: settings.language,
        reminder_style: settings.reminderStyle,
        default_reminder_time: settings.defaultReminderTime, // Will be undefined on initial save
        week_starts_on: settings.weekStartsOn,
        date_format: settings.dateFormat,
        time_format: settings.timeFormat,
      }

      const { error: settingsError } = await supabase.from("user_settings").upsert(userSettingsDataSnakeCase, {
        onConflict: "user_id",
      })

      if (settingsError) {
        console.error("Error saving user_settings:", settingsError)
        throw settingsError
      }

      console.log(`Settings ${isInitialSave ? "created with defaults" : "saved"} successfully for user ${userId}!`)
    } catch (error) {
      console.error("Error in SettingsService.saveSettings:", error)
      throw error
    }
  }
}
