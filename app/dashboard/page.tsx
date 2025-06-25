"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { CreateReminderModal } from "@/components/reminders/create-reminder-modal"
import { CreateMicroActionModal } from "@/components/micro-actions/create-micro-action-modal"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
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
  const supabase = createClient()

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

  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showMicroActionModal, setShowMicroActionModal] = useState(false)
  const [reminders, setReminders] = useState([])
  const [microActions, setMicroActions] = useState([])
  const [activeTab, setActiveTab] = useState("inspiration")

  useEffect(() => {
    if (userWithProfile) {
      try {
        const savedReminders = localStorage.getItem(`reminders_${userWithProfile.id}`)
        if (savedReminders) setReminders(JSON.parse(savedReminders))

        const savedMicroActions = localStorage.getItem(`microActions_${userWithProfile.id}`)
        if (savedMicroActions) setMicroActions(JSON.parse(savedMicroActions))
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
        setReminders([])
        setMicroActions([])
      }
    }
  }, [user]) // Removed userWithProfile from dependency array

  const handleReminderCreated = (data: ReminderFormData) => {
    // Expect ReminderFormData
    if (!userWithProfile) {
      console.error("User not available for creating reminder.")
      return
    }
    const newReminder = {
      id: Date.now().toString(),
      ...data, // Spread the data from the form
      completed: false, // Default value
      createdAt: new Date().toISOString(),
      userId: userWithProfile.id,
    }
    const updatedReminders = [...reminders, newReminder]
    setReminders(updatedReminders)
    localStorage.setItem(`reminders_${userWithProfile.id}`, JSON.stringify(updatedReminders))
    setShowReminderModal(false)
  }

  const handleMicroActionCreated = (data: MicroActionFormData) => {
    // Expect MicroActionFormData
    if (!userWithProfile) {
      console.error("User not available for creating micro-action.")
      return
    }
    const newMicroAction = {
      id: Date.now().toString(),
      ...data, // Spread the data from the form
      currentStreak: 0,
      bestStreak: 0,
      completedToday: false,
      createdAt: new Date().toISOString(),
      userId: userWithProfile.id,
    }
    const updatedMicroActions = [...microActions, newMicroAction]
    setMicroActions(updatedMicroActions)
    localStorage.setItem(`microActions_${userWithProfile.id}`, JSON.stringify(updatedMicroActions))
    setShowMicroActionModal(false)
  }

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
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={cn("flex-1 p-6 transition-all duration-300", sidebarOpen ? "md:ml-64" : "ml-0")}>
          <DashboardClientContent
            user={userWithProfile}
            reminders={reminders}
            microActions={microActions}
            setReminders={setReminders}
            setMicroActions={setMicroActions}
            showReminderModal={showReminderModal}
            setShowReminderModal={setShowReminderModal}
            showMicroActionModal={showMicroActionModal}
            setShowMicroActionModal={setShowMicroActionModal}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </main>
      </div>
      <CreateReminderModal
        open={showReminderModal}
        onOpenChange={setShowReminderModal}
        onReminderCreated={handleReminderCreated}
      />
      <CreateMicroActionModal
        open={showMicroActionModal}
        onOpenChange={setShowMicroActionModal}
        onMicroActionCreated={handleMicroActionCreated}
      />
    </div>
  )
}
