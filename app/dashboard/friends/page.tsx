// NO "use client" at the top for server-side logic
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/lib/auth/actions"
import { Header } from "@/components/dashboard/header"
import type { User } from "@supabase/supabase-js"
import { FriendsPageClientContent } from "@/components/dashboard/friends-page-client-content" // New client component

// Define UserProfile type (can be shared in a types file later)
interface UserProfile extends User {
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
}

export default async function FriendsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name, profile_image_url")
    .eq("id", user.id)
    .single()

  if (profileError && profileError.code !== "PGRST116") {
    // PGRST116 means no rows found, which is fine if a profile hasn't been created yet
    console.error("Error fetching profile for friends page:", profileError)
    // Depending on your app's logic, you might want to handle this more gracefully
  }

  const userWithProfile: UserProfile = {
    ...user,
    firstName: profile?.first_name,
    lastName: profile?.last_name,
    profileImage: profile?.profile_image_url,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={userWithProfile} onLogout={signOut} />
      <FriendsPageClientContent user={userWithProfile} />
    </div>
  )
}
