"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Keep if needed for client-side navigation
import { Sidebar } from "@/components/dashboard/sidebar"
import { FriendsDashboard } from "@/components/friends/friends-dashboard"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"

// Define UserProfile type (must match the one passed from the server component)
interface UserProfile extends User {
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
}

interface FriendsPageClientContentProps {
  user: UserProfile
}

export function FriendsPageClientContent({ user }: FriendsPageClientContentProps) {
  const router = useRouter() // Still available for client-side routing needs
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // The original FriendsPage had a loading state from useAuth.
  // Now, the parent Server Component handles the loading/redirect if not authenticated.
  // So, if this component renders, we know the user is authenticated.

  // The original FriendsPage also had a signOut function from useAuth.
  // That's now handled by the Header component, which receives the signOut server action.

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={cn("flex-1 p-6 transition-all duration-300", sidebarOpen ? "md:ml-64" : "ml-0")}>
        {/* Pass the user prop to FriendsDashboard if it needs it */}
        <FriendsDashboard user={user} />
      </main>
    </div>
  )
}
