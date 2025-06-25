"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SettingsService, type UserSettings } from "@/lib/settings-service"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ProfileDetailsForm } from "@/components/settings/profile-details-form"
import { UserPreferencesCard } from "@/components/settings/user-preferences"
import { NotificationSettingsCard } from "@/components/notifications/notification-settings"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { logout } from "@/lib/auth/actions"

interface SettingsClientContentProps {
  user: User
  initialSettings: UserSettings
}

export default function SettingsClientContent({ user, initialSettings }: SettingsClientContentProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState<UserSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSettingsChange = useCallback((newSettings: Partial<UserSettings>) => {
    const { profileImage, ...restOfSettings } = newSettings as any
    setSettings((prev) => ({ ...prev, ...restOfSettings }))
  }, [])

  const handleSave = async () => {
    if (!settings || !user) return
    setIsSaving(true)
    try {
      await SettingsService.saveSettings(settings, user.id)
      toast({
        title: "Success!",
        description: "Your settings have been saved.",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setSettings(initialSettings)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings)

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={cn("flex-1 p-4 md:p-6 transition-all duration-300", sidebarOpen ? "md:ml-64" : "ml-0")}>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
              </div>
              {hasChanges && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReset} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                <p className="text-sm text-muted-foreground p-4 border rounded-md">
                  Profile image upload temporarily disabled for debugging.
                </p>
              </div>
              <div className="lg:col-span-2 space-y-8">
                <ProfileDetailsForm settings={settings} onSettingsChange={handleSettingsChange} />
                <UserPreferencesCard />
                <NotificationSettingsCard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
