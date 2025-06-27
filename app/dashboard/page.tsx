import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/lib/auth/actions"
import { Header } from "@/components/dashboard/header"
import { DashboardClientContent } from "@/components/dashboard/dashboard-client-content"

interface UserProfile {
  id: string
  email?: string
  user_metadata?: {
    firstName?: string
    lastName?: string
    profileImage?: string
  }
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
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

  return (
    <div className="min-h-screen bg-background">
      <Header user={userWithProfile} onLogout={signOut} />
      <DashboardClientContent user={userWithProfile} />
    </div>
  )
}
