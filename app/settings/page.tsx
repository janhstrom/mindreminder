import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SettingsService } from "@/lib/settings-service"
import { SettingsClientContent } from "@/components/settings/settings-client-content"
import type { UserSettings } from "@/types"

interface UserProfile {
  id: string
  email?: string
  user_metadata?: {
    firstName?: string
    lastName?: string
    profileImage?: string
  }
}

export default async function SettingsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login?message=Please log in to access settings.")
  }

  const userWithProfile: UserProfile = {
    id: user.id,
    email: user.email,
    user_metadata: {
      firstName: user.user_metadata?.firstName || user.user_metadata?.first_name || null,
      lastName: user.user_metadata?.lastName || user.user_metadata?.last_name || null,
      profileImage: user.user_metadata?.profileImage || user.user_metadata?.profile_image_url || null,
    },
  }

  let settings: UserSettings
  try {
    settings = await SettingsService.getSettings(user.id)
  } catch (error) {
    console.error("SettingsPage: Failed to fetch settings:", error)
    // Provide fallback settings
    settings = {
      userId: user.id,
      theme: "system",
      notifications: true,
      emailNotifications: true,
      timezone: "UTC",
      language: "en",
      dateFormat: "MM/dd/yyyy",
      timeFormat: "12h",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  return <SettingsClientContent user={userWithProfile} initialSettings={settings} />
}
