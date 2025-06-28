import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardClientContent } from "@/components/dashboard/dashboard-client-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <DashboardClientContent user={user} />
}
