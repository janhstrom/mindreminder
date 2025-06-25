import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardClientContent from "@/components/dashboard/dashboard-client-content"
import type { Reminder, MicroAction } from "@/types" // Ensure these types are correctly defined

// Placeholder: Define or import actual functions to fetch data
// For example, from "@/lib/reminders-supabase" or "@/lib/micro-actions-service"
async function getRemindersForUser(userId: string, supabaseClient: any): Promise<Reminder[]> {
  // console.log(`Fetching reminders for user ${userId}...`)
  // const { data, error } = await supabaseClient
  //   .from('reminders')
  //   .select('*')
  //   .eq('user_id', userId)
  // if (error) {
  //   console.error("Error fetching reminders:", error)
  //   return []
  // }
  // return data || []
  return [] // Placeholder
}

async function getMicroActionsForUser(userId: string, supabaseClient: any): Promise<MicroAction[]> {
  // console.log(`Fetching micro-actions for user ${userId}...`)
  // const { data, error } = await supabaseClient
  //   .from('micro_actions')
  //   .select('*')
  //   .eq('user_id', userId)
  // if (error) {
  //   console.error("Error fetching micro-actions:", error)
  //   return []
  // }
  // return data || []
  return [] // Placeholder
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login?message=Please log in to access the dashboard.")
  }

  let reminders: Reminder[] = []
  let microActions: MicroAction[] = []

  try {
    reminders = await getRemindersForUser(user.id, supabase)
  } catch (error) {
    console.error("DashboardPage: Failed to fetch reminders:", error)
  }

  try {
    microActions = await getMicroActionsForUser(user.id, supabase)
  } catch (error) {
    console.error("DashboardPage: Failed to fetch micro-actions:", error)
  }

  return <DashboardClientContent user={user} reminders={reminders} microActions={microActions} />
}
