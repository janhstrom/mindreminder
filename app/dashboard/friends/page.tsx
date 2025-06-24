"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { FriendsDashboard } from "@/components/friends/friends-dashboard" // Re-added
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

export default function FriendsPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Logout error:", error)
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" })
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        onProfileClick={() => router.push("/settings")}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={cn("flex-1 p-6 transition-all duration-300", sidebarOpen ? "md:ml-64" : "ml-0")}>
          <FriendsDashboard user={user} />
        </main>
      </div>
    </div>
  )
}
