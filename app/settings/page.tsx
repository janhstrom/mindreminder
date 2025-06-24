"use client"

import type React from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react" // Added Suspense
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { AuthUser } from "@/lib/auth-supabase"
import { UserPreferencesCard } from "@/components/settings/user-preferences"
// Corrected import name based on file export
import { NotificationSettingsCard } from "@/components/notifications/notification-settings"
import { Bell, UserIcon } from "lucide-react"

// Helper to create a placeholder for a component that might be missing or slow to load
const SafeComponentLoader = ({ children, name }: { children: React.ReactNode; name: string }) => {
  return (
    <Suspense
      fallback={
        <div className="p-4 border border-dashed rounded-md">
          <p className="text-sm text-muted-foreground">Loading {name}...</p>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export default function SettingsPage() {
  const { user, loading, signOut, updateProfile } = useAuth()
  const router = useRouter() // Not strictly needed here if AuthProvider handles all redirects
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setProfileImage(user.profileImage || "")
    }
  }, [user, loading])

  const handleLogout = async () => {
    try {
      await signOut()
      // AuthProvider should redirect to /login or /
    } catch (error) {
      console.error("Logout error on settings page:", error)
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" })
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !updateProfile) return
    setIsSaving(true)
    try {
      const updatedUserData: Partial<AuthUser> = { firstName, lastName, profileImage }
      await updateProfile(updatedUserData)
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." })
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update Failed",
        description: "Could not update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
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
        onLogout={handleLogout} // Ensure this is passed and used
        onProfileClick={() => {
          /* Already on profile */
        }}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={cn("flex-1 p-6 transition-all duration-300", sidebarOpen ? "md:ml-64" : "ml-0")}>
          <div className="max-w-3xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" /> Profile Settings
                </CardTitle>
                <CardDescription>Update your personal information and profile picture.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profileImage || `/placeholder.svg?width=96&height=96&query=User+Avatar`}
                        alt={user.firstName || "User"}
                      />
                      <AvatarFallback>{(user.firstName?.[0] || "U") + (user.lastName?.[0] || "")}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 flex-1 w-full">
                      <Label htmlFor="profileImage">Profile Image URL</Label>
                      <Input
                        id="profileImage"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        placeholder="https://example.com/image.png"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <SafeComponentLoader name="User Preferences">
              <UserPreferencesCard />
            </SafeComponentLoader>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" /> Notifications
                </CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent>
                <SafeComponentLoader name="Notification Settings">
                  <NotificationSettingsCard />
                </SafeComponentLoader>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleLogout} disabled={loading}>
                  {loading ? "Logging out..." : "Log Out"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
