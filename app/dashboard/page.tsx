"use client"
import { Header } from "@/components/dashboard/header"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server" // Import remains the same
import { cookies } from "next/headers" // Import cookies here
import { redirect } from "next/navigation"
import { logout } from "@/lib/auth/actions"
import { DashboardClientContent } from "@/components/dashboard/dashboard-client-content"
import type { User } from "@supabase/supabase-js"

// Define types for data passed from modals
interface ReminderFormData {
  title: string
  description?: string
  scheduledTime?: string
  isActive: boolean
}

interface MicroActionFormData {
  title: string
  description?: string
  category: string
  duration: string
  frequency: string
  isActive: boolean
}

// Define a more specific UserProfile type based on your 'profiles' table
interface UserProfile extends User {
  firstName?: string
  lastName?: string
  profileImage?: string
  // Add other fields from your 'profiles' table that you need
}

export default async function DashboardPage() {
  const cookieStore = cookies() // Call cookies() here
  const supabase = createSupabaseServerClient(cookieStore) // Pass cookieStore to createClient

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile details from your 'profiles' table
  // Adjust this query based on your actual table structure and how you link users to profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name, profile_image_url")
    .eq("id", user.id)
    .single()

  if (profileError && profileError.code !== "PGRST116") {
    // PGRST116: 'single' row not found
    console.error("Error fetching profile:", profileError)
    // Handle error appropriately, maybe redirect or show an error message
  }

  const userWithProfile: UserProfile = {
    ...user,
    firstName: profile?.first_name || user.email?.split("@")[0] || "User",
    lastName: profile?.last_name,
    profileImage: profile?.profile_image_url,
  }

  // The rest of the component remains largely the same,
  // but it no longer needs its own client-side state for reminders/microActions
  // as that's handled by DashboardClientContent.
  // The local state for sidebarOpen, modals, activeTab can be moved to DashboardClientContent
  // or passed down if this page remains a server component that wraps a client component.

  // For simplicity in this step, assuming DashboardClientContent handles its own state
  // or receives initial values. The main change is how `supabase` client is created.

  return (
    <div className="min-h-screen bg-background">
      {/* Header now receives user data and logout action */}
      <Header user={userWithProfile} onLogout={logout} />
      <div className="flex">
        {/* 
          Sidebar might need to be a client component if it has internal state 
          for being open/closed that's not controlled by URL.
          If its state is managed by DashboardClientContent, that's fine.
        */}
        <DashboardClientContent
          user={userWithProfile}
          // Pass other necessary props or let DashboardClientContent fetch/manage its own data
        />
      </div>
      {/* Modals might also be better managed within DashboardClientContent or triggered via props */}
    </div>
  )
}
