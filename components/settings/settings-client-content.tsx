"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ProfileDetailsForm } from "@/components/settings/profile-details-form"
import { UserPreferences } from "@/components/settings/user-preferences"
import { NotificationSettings } from "@/components/notifications/notification-settings"
import { signOut } from "@/lib/auth/actions"
import { SettingsService } from "@/lib/settings-service"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Palette, Shield } from "lucide-react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImage?: string | null
  createdAt: string
  emailConfirmed: boolean
}

interface UserSettings {
  id: string
  theme: string
  notifications_enabled: boolean
  email_notifications: boolean
  push_notifications: boolean
  reminder_sound: boolean
  daily_summary: boolean
  timezone: string
  language: string
  date_format: string
  time_format: string
  created_at: string
  updated_at: string
}

interface SettingsClientContentProps {
  user: User
  initialSettings: UserSettings
}

export function SettingsClientContent({ user, initialSettings }: SettingsClientContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settings, setSettings] = useState<UserSettings>(initialSettings)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleSettingsChange = async (newSettings: Partial<UserSettings>) => {
    setLoading(true)
    try {
      const updatedSettings = { ...settings, ...newSettings }
      await SettingsService.updateSettings(user.id, updatedSettings)
      setSettings(updatedSettings)
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "ml-0"}`}>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account settings and preferences.</p>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  {/* User Icon Placeholder */}
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileDetailsForm
                      user={user}
                      settings={settings}
                      onSettingsChange={handleSettingsChange}
                      loading={loading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NotificationSettings
                      settings={settings}
                      onSettingsChange={handleSettingsChange}
                      loading={loading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserPreferences settings={settings} onSettingsChange={handleSettingsChange} loading={loading} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Account Status</h3>
                          <p className="text-sm text-gray-600">
                            Email: {user.emailConfirmed ? "Verified" : "Not verified"}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button variant="destructive" onClick={handleLogout}>
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
