"use client"

import { supabase } from "./supabase"

export interface UserSettings {
  // Notifications
  pushEnabled: boolean
  emailEnabled: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  quietHours: boolean
  quietStart: string
  quietEnd: string

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
  defaultReminderTime: string
  weekStartsOn: string
  dateFormat: string
  timeFormat: string
  // profileImage?: string; // Let's keep this out of UserSettings for now, handle separately
}

const DEFAULT_SETTINGS_VALUES: Omit<UserSettings, "firstName" | "lastName" | "email" | "bio"> = {
  pushEnabled: true,
  emailEnabled: false,
  soundEnabled: true,
  vibrationEnabled: true,
  quietHours: false,
  quietStart: "22:00",
  quietEnd: "08:00",
  timezone: "America/New_York", // Default, consider user's locale or a picker
  theme: "system",
  language: "en",
  reminderStyle: "gentle",
  defaultReminderTime: "09:00",
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
      // PGRST116: 0 rows
      console.error("Error fetching profile data for settings:", error)
    }
    return {
      firstName: data?.first_name ?? "User",
      lastName: data?.last_name ?? "",
      email: data?.email ?? "", // This should ideally come from auth user object
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
        .maybeSingle() // Use maybeSingle() to return null if not found, instead of erroring

      if (settingsError) {
        console.error("Error fetching user_settings from Supabase:", settingsError)
        // If there's an actual error (not just 'not found'), throw to outer catch
        throw settingsError
      }

      if (settingsData) {
        // Settings found, combine with profile and return
        return {
          ...DEFAULT_SETTINGS_VALUES, // Ensure all keys exist
          ...profileInfo,
          email: profileInfo.email || "user@example.com", // Ensure email is not undefined
          ...settingsData, // DB settings override defaults
          user_id: undefined, // remove user_id from the returned object if it's there
        } as UserSettings
      } else {
        // No settings row found, create one with defaults
        console.log(`No settings found for user ${userId}. Creating default settings.`)
        const defaultSettingsForUser: UserSettings = {
          ...DEFAULT_SETTINGS_VALUES,
          ...profileInfo,
          email: profileInfo.email || "user@example.com", // Ensure email is not undefined
        }

        // Call saveSettings to insert the new default row.
        // saveSettings itself will handle the profile part if needed, but we already have it.
        // We need to ensure saveSettings can insert if user_settings row doesn't exist.
        // The `upsert` in saveSettings should handle this.
        await this.saveSettings(defaultSettingsForUser, userId, true) // Pass a flag to indicate it's an initial save

        return defaultSettingsForUser
      }
    } catch (error) {
      console.error("Critical error in SettingsService.getSettings, returning hardcoded defaults:", error)
      // Fallback to absolute hardcoded defaults if anything above fails critically
      const profileDefaults = { firstName: "User", lastName: "", email: "user@example.com", bio: "" }
      return {
        ...DEFAULT_SETTINGS_VALUES,
        ...profileDefaults,
      }
    }
  }

  static async saveSettings(settings: UserSettings, userId: string, isInitialSave = false): Promise<void> {
    try {
      // Separate profile data from user_settings data
      const profileUpdates = {
        email: settings.email, // Be cautious: updating email here might conflict with auth email
        first_name: settings.firstName,
        last_name: settings.lastName,
        bio: settings.bio,
      }

      // Update profile - only if not an initial save triggered by getSettings,
      // or if specific fields have changed. For simplicity, always update for now.
      const { error: profileError } = await supabase.from("profiles").update(profileUpdates).eq("id", userId)

      if (profileError) {
        console.error("Error updating profile:", profileError)
        // Decide if this should throw or just log
      }

      // Prepare user_settings data (exclude profile fields)
      const userSettingsData: Omit<UserSettings, "firstName" | "lastName" | "email" | "bio"> & { user_id: string } = {
        user_id: userId,
        pushEnabled: settings.pushEnabled,
        emailEnabled: settings.emailEnabled,
        soundEnabled: settings.soundEnabled,
        vibrationEnabled: settings.vibrationEnabled,
        quietHours: settings.quietHours,
        quietStart: settings.quietStart,
        quietEnd: settings.quietEnd,
        timezone: settings.timezone,
        theme: settings.theme,
        language: settings.language,
        reminderStyle: settings.reminderStyle,
        defaultReminderTime: settings.defaultReminderTime,
        weekStartsOn: settings.weekStartsOn,
        dateFormat: settings.dateFormat,
        timeFormat: settings.timeFormat,
      }

      // Upsert settings
      const { error: settingsError } = await supabase.from("user_settings").upsert(userSettingsData, {
        onConflict: "user_id",
      })

      if (settingsError) {
        console.error("Error saving user_settings:", settingsError)
        throw settingsError
      }

      console.log(`Settings ${isInitialSave ? "created with defaults" : "saved"} successfully for user ${userId}!`)
    } catch (error) {
      console.error("Error in SettingsService.saveSettings:", error)
      throw error // Re-throw to be caught by the calling component
    }
  }
}
