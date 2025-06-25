// NO "use client" at the top for server-side logic
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/lib/auth/actions" // Import the new signOut action
import { Header } from "@/components/dashboard/header" // Assuming you want the same header
import { Sidebar } from "@/components/dashboard/sidebar" // Assuming you want the same sidebar
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"

// Define UserProfile type (can be shared in a types file later)
interface UserProfile extends User {
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
}

// This component will handle client-side state for the sidebar if needed
// For now, let's make it simple. If sidebar state is complex, extract to a client component.
function AnalyticsPageClientContent({ user }: { user: UserProfile }) {
  // If you need client-side interactions for the sidebar or other elements,
  // this component would be marked with 'use client' and contain useState/useEffect.
  // For now, assuming sidebar state is simple or managed elsewhere.
  // const [sidebarOpen, setSidebarOpen] = useState(false); // Example if needed

  return (
    <div className="flex">
      <Sidebar
        isOpen={false} /* Placeholder: manage sidebar state appropriately */
        onClose={() => {
          /* Placeholder */
        }}
      />
      <main className={cn("flex-1 p-6 transition-all duration-300", /* sidebarOpen ? "md:ml-64" : */ "ml-0")}>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analytics dashboard is under development. Track your progress and insights here soon! Welcome,{" "}
                {user.firstName || user.email}!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default async function AnalyticsPage() {
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
    console.error("Error fetching profile for analytics page:", profileError)
  }

  const userWithProfile: UserProfile = {
    ...user,
    firstName: profile?.first_name,
    lastName: profile?.last_name,
    profileImage: profile?.profile_image_url,
  }

  // The onMenuClick for the Header to toggle a sidebar needs careful state management.
  // If sidebar state is local to AnalyticsPageClientContent, Header can't directly control it
  // without prop drilling or a shared state solution (like Zustand/Jotai or React Context if simple).
  // For now, simplifying by not having Header control sidebar state here.
  return (
    <div className="min-h-screen bg-background">
      <Header
        user={userWithProfile}
        onLogout={signOut}
        // onMenuClick={() => setSidebarOpen(true)} // This needs client-side state management
      />
      <AnalyticsPageClientContent user={userWithProfile} />
    </div>
  )
}
