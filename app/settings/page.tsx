import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SettingsService, type UserSettings } from "@/lib/settings-service"
import SettingsClientContent from "@/components/settings/settings-client-content"

const getDefaultSettings = (user: any): UserSettings => ({
  pushEnabled: true,
  emailEnabled: false,
  soundEnabled: true,
  vibrationEnabled: true,
  quietHours: false,
  quietStart: "22:00",
  quietEnd: "08:00",
  firstName: (user.user_metadata?.firstName as string) || "",
  lastName: (user.user_metadata?.lastName as string) || "",
  email: user.email || "",
  timezone: "UTC",
  bio: "",
  theme: "system",
  language: "en",
  reminderStyle: "gentle",
  defaultReminderTime: "09:00",
  weekStartsOn: "monday",
  dateFormat: "MM/dd/yyyy",
  timeFormat: "12h",
})

export default async function SettingsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    redirect("/login")
  }

  let settings: UserSettings
  try {
    const fetchedSettings = await SettingsService.getSettings(user.id)
    settings = {
      ...getDefaultSettings(user),
      ...fetchedSettings,
      quietStart: fetchedSettings.quietStart || "22:00",
      quietEnd: fetchedSettings.quietEnd || "08:00",
      defaultReminderTime: fetchedSettings.defaultReminderTime || "09:00",
      firstName: fetchedSettings.firstName || (user.user_metadata?.firstName as string) || "",
      lastName: fetchedSettings.lastName || (user.user_metadata?.lastName as string) || "",
    }
  } catch (error) {
    console.error("Failed to fetch settings, using defaults:", error)
    settings = getDefaultSettings(user)
  }

  return <SettingsClientContent user={user} initialSettings={settings} />
}
