"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { ProfileDetailsForm } from "@/components/settings/profile-details-form"
import { UserPreferences } from "@/components/settings/user-preferences"
import { NotificationSettings } from "@/components/notifications/notification-settings"
import { SettingsService } from "@/lib/settings-service"
import { signOut } from "@/lib/auth/actions"
import type { UserSettings } from "@/types"

interface UserProfile {
  id: string
  email?: string
  user_metadata?: {
    firstName?: string
    lastName?: string
    profileImage?: string
  }
}

interface SettingsClientContentProps {
  user: UserProfile
  initialSettings: UserSettings
}

export function SettingsClientContent({ user, initialSettings }: SettingsClientContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settings, setSettings] = useState<UserSettings>(initialSettings)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    await signOut()
  }

  const handleSettingsChange = async (newSettings: Partial<UserSettings>) => {
    setIsLoading(true)
    try {
      const updatedSettings = { ...settings, ...newSettings }
      await SettingsService.updateSettings(user.id, updatedSettings)
      setSettings(updatedSettings)
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Failed to update settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={cn("flex-1 p-4 md:p-6 transition-all duration-300", sidebarOpen ? "md:ml-64" : "ml-0")}>
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and profile details.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileDetailsForm
                      user={user}
                      settings={settings}
                      onSettingsChange={handleSettingsChange}
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Preferences</CardTitle>
                    <CardDescription>Customize your app experience with these preferences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserPreferences
                      settings={settings}
                      onSettingsChange={handleSettingsChange}
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure how and when you receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NotificationSettings
                      settings={settings}
                      onSettingsChange={handleSettingsChange}
                      isLoading={isLoading}
                    />
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
