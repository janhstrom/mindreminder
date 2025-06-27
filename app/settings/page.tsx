import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsService } from "@/lib/settings-service"
import { SettingsClientContent } from "@/components/settings/settings-client-content"

export default async function SettingsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const userData = {
    id: user.id,
    email: user.email || "",
    firstName: profile?.first_name || user.user_metadata?.first_name || "",
    lastName: profile?.last_name || user.user_metadata?.last_name || "",
    profileImage: profile?.profile_image || user.user_metadata?.profile_image || null,
    createdAt: user.created_at,
    emailConfirmed: !!user.email_confirmed_at,
  }

  // Fetch user settings
  let settings
  try {
    settings = await SettingsService.getSettings(user.id)
  } catch (error) {
    console.error("Error fetching settings:", error)
    // Provide default settings if fetch fails
    settings = {
      id: user.id,
      theme: "system",
      notifications_enabled: true,
      email_notifications: true,
      push_notifications: false,
      reminder_sound: true,
      daily_summary: true,
      timezone: "UTC",
      language: "en",
      date_format: "MM/dd/yyyy",
      time_format: "12h",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  return <SettingsClientContent user={userData} initialSettings={settings} />
}
