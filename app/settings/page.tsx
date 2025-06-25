import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SettingsService, type UserSettings } from "@/lib/settings-service"
import SettingsClientContent from "@/components/settings/settings-client-content"

export default async function SettingsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login?message=Please log in to access settings.")
  }

  let settings: UserSettings
  try {
    settings = await SettingsService.getSettings(user.id)
  } catch (error) {
    console.error("Failed to fetch settings for user:", user.id, error)
    // Fallback to default settings if fetching fails or no settings exist
    // Ensure all fields from UserSettings are present
    settings = {
      id: user.id, // Use user.id as a fallback or generate a new one if your service expects it
      userId: user.id,
      firstName: user.user_metadata?.firstName || "",
      lastName: user.user_metadata?.lastName || "",
      email: user.email || "",
      // profileImage: user.user_metadata?.profileImage || "", // Handled by avatar logic or separate upload
      dateFormat: "MM/DD/YYYY",
      timeFormat: "h:mm A",
      timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
      enableNotifications: true,
      notificationSound: "default",
      theme: "system",
      language: "en",
      createdAt: new Date().toISOString(), // Should ideally come from DB or be set on creation
      updatedAt: new Date().toISOString(), // Should ideally come from DB
    }
  }

  return <SettingsClientContent user={user} initialSettings={settings} />
}
