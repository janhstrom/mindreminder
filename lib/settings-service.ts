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
    console.log("[SettingsService] Attempting to fetch profile data for user:", userId)
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, email, bio")
      .eq("id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[SettingsService] Error fetching profile data:", error)
    } else {
      console.log("[SettingsService] Successfully fetched profile data:", data)
    }
    return {
      firstName: data?.first_name ?? "User",
      lastName: data?.last_name ?? "",
      email: data?.email ?? "",
      bio: data?.bio ?? "",
    }
  }

  static async getSettings(userId: string): Promise<UserSettings> {
    console.log(`[SettingsService] getSettings called for user: ${userId}`)
    try {
      console.log("[SettingsService] Step 1: Fetching profile info...")
      const profileInfo = await this.getProfileData(userId)
      console.log("[SettingsService] Step 1 Complete. Profile info:", profileInfo)

      console.log("[SettingsService] Step 2: Fetching user_settings...")
      const { data: settingsData, error: settingsError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle()
      console.log("[SettingsService] Step 2 Complete. Settings data:", settingsData, "Error:", settingsError)

      if (settingsError) {
        console.error("[SettingsService] Error fetching user_settings from Supabase:", settingsError)
        throw settingsError
      }

      if (settingsData) {
        console.log("[SettingsService] Settings found. Merging with defaults and profile info.")
        const finalSettings = {
          ...DEFAULT_SETTINGS_VALUES,
          ...profileInfo,
          email: profileInfo.email || "user@example.com",
          ...settingsData,
          user_id: undefined,
        } as UserSettings
        console.log("[SettingsService] Returning merged settings:", finalSettings)
        return finalSettings
      } else {
        console.log(`[SettingsService] No settings found for user ${userId}. Creating and returning default settings.`)
        const defaultSettingsForUser: UserSettings = {
          ...DEFAULT_SETTINGS_VALUES,
          ...profileInfo,
          email: profileInfo.email || "user@example.com",
        }
        await this.saveSettings(defaultSettingsForUser, userId, true)
        console.log("[SettingsService] Returning new default settings:", defaultSettingsForUser)
        return defaultSettingsForUser
      }
    } catch (error) {
      console.error("[SettingsService] Critical error in getSettings. Returning hardcoded defaults.", error)
      const profileDefaults = { firstName: "User", lastName: "", email: "user@example.com", bio: "" }
      const fallback = {
        ...DEFAULT_SETTINGS_VALUES,
        ...profileDefaults,
      }
      console.log("[SettingsService] Returning fallback settings:", fallback)
      return fallback
    }
  }

  static async saveSettings(settings: UserSettings, userId: string, isInitialSave = false): Promise<void> {
    try {
      const profileUpdates = {
        first_name: settings.firstName,
        last_name: settings.lastName,
        bio: settings.bio,
      }
      const { error: profileError } = await supabase.from("profiles").update(profileUpdates).eq("id", userId)

      if (profileError) {
        console.error("Error updating profile:", profileError)
      }

      const userSettingsDataSnakeCase = {
        user_id: userId,
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
