import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardClientContent } from "@/components/dashboard/dashboard-client-content"

export default async function DashboardPage() {
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

  return <DashboardClientContent user={userData} />
}
