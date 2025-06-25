"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth/auth-provider"
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

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [initialSettings, setInitialSettings] = useState<UserSettings | null>(null)

  // Log auth state on every render
  console.log("[SettingsPage] Rendering. AuthLoading:", authLoading, "User:", user)

  useEffect(() => {
    console.log("[SettingsPage] Auth effect triggered. AuthLoading:", authLoading, "User:", user)
    if (!authLoading && !user) {
      console.log("[SettingsPage] Not authenticated, redirecting to /login")
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    console.log("[SettingsPage] Settings fetch effect triggered. User:", user)
    if (user) {
      console.log(`[SettingsPage] User found (ID: ${user.id}). Attempting to fetch settings.`)
      SettingsService.getSettings(user.id)
        .then((fetchedSettings) => {
          console.log("[SettingsPage] Successfully fetched settings:", fetchedSettings)
          const processedSettings: UserSettings = {
            ...fetchedSettings,
            quietStart: fetchedSettings.quietStart || "",
            quietEnd: fetchedSettings.quietEnd || "",
            defaultReminderTime: fetchedSettings.defaultReminderTime || "",
          }
          setSettings(processedSettings)
          setInitialSettings(processedSettings)
        })
        .catch((error) => {
          console.error("[SettingsPage] Error fetching settings in page useEffect:", error)
          toast({
            title: "Error Loading Settings",
            description: "Could not load your settings. Please try again later.",
            variant: "destructive",
          })
          const defaultFallback: UserSettings = {
            pushEnabled: true,
            emailEnabled: false,
            soundEnabled: true,
            vibrationEnabled: true,
            quietHours: false,
            quietStart: "",
            quietEnd: "",
            firstName: "User",
            lastName: "",
            email: user.email || "", // Ensure user.email is accessed safely
            timezone: "UTC",
            bio: "",
            theme: "system",
            language: "en",
            reminderStyle: "gentle",
            defaultReminderTime: "",
            weekStartsOn: "monday",
            dateFormat: "MM/dd/yyyy",
            timeFormat: "12h",
          }
          setSettings(defaultFallback)
          setInitialSettings(defaultFallback)
        })
    } else {
      console.log("[SettingsPage] No user found in settings fetch effect. Skipping settings fetch.")
    }
  }, [user, toast]) // Dependency array includes user

  const handleSettingsChange = useCallback((newSettings: Partial<UserSettings>) => {
    const { profileImage, ...restOfSettings } = newSettings as any
    setSettings((prev) => (prev ? { ...prev, ...restOfSettings } : null))
  }, [])

  const handleSave = async () => {
    if (!settings || !user) return
    setIsSaving(true)
    try {
      await SettingsService.saveSettings(settings, user.id)
      setInitialSettings(settings)
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

  // This is the loading condition
  if (authLoading || !settings) {
    console.log("[SettingsPage] Showing loader. AuthLoading:", authLoading, "Settings is null:", !settings)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings)

  return (
    <div className="min-h-screen bg-background">
      <Header user={user!} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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
