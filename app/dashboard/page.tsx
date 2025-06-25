// NO "use client" directive at the top of this file

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { User } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/lib/auth/actions"
import { Header } from "@/components/dashboard/header"
import { DashboardClientContent } from "@/components/dashboard/dashboard-client-content"

// Define a more specific UserProfile type
interface UserProfile extends User {
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("Auth error fetching user:", authError)
    // Decide how to handle auth errors, e.g., redirect to login
    redirect("/login?message=Authentication error, please login again.")
  }

  if (!user) {
    redirect("/login")
  }

  // Simplified user profile construction, bypassing direct 'profiles' table query for now
  // This attempts to use user_metadata which might be populated during sign-up
  // or falls back to empty/null values.
  const userWithProfile: UserProfile = {
    ...user,
    firstName: user.user_metadata?.firstName || user.user_metadata?.first_name || null,
    lastName: user.user_metadata?.lastName || user.user_metadata?.last_name || null,
    profileImage: user.user_metadata?.profileImage || user.user_metadata?.profile_image_url || null,
    // Ensure all properties expected by Header and DashboardClientContent are present
    // even if they are null or default.
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={userWithProfile} onLogout={signOut} />
      <DashboardClientContent user={userWithProfile} />
    </div>
  )
}
