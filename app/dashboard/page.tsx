// NO "use client" at the top of this file
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/lib/auth/actions" // Corrected import: signOut
import { Header } from "@/components/dashboard/header"
import { DashboardClientContent } from "@/components/dashboard/dashboard-client-content"
import type { User } from "@supabase/supabase-js"

// Define a more specific UserProfile type based on your 'profiles' table
// Ensure this matches the data you select and return
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
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile details from your 'profiles' table
  // Ensure your table columns match 'first_name', 'last_name', 'profile_image_url'
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name, profile_image_url")
    .eq("id", user.id)
    .single()

  // Handle potential error fetching profile, but don't block rendering
  if (profileError && profileError.code !== "PGRST116") {
    console.error("Error fetching profile:", profileError)
  }

  const userWithProfile: UserProfile = {
    ...user,
    firstName: profile?.first_name,
    lastName: profile?.last_name,
    profileImage: profile?.profile_image_url,
  }

  // All client-side state and logic is now in DashboardClientContent.
  // This Server Component's only job is to fetch data and render the layout.
  return (
    <div className="min-h-screen bg-background">
      <Header user={userWithProfile} onLogout={signOut} /> {/* Corrected prop: signOut */}
      <DashboardClientContent user={userWithProfile} />
    </div>
  )
}
