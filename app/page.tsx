"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ReminderForm } from "@/components/reminders/reminder-form"
import { ReminderCard } from "@/components/reminders/reminder-card"
import { QuoteGenerator } from "@/components/quotes/quote-generator"
import { NotificationSettingsCard } from "@/components/notifications/notification-settings"
import { UserPreferencesCard } from "@/components/settings/user-preferences"
import { ProfileImageUpload } from "@/components/settings/profile-image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Bell, Quote, Calendar } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"
import { Analytics } from "@/lib/analytics"
import { NotificationService } from "@/lib/notifications"
import { UserPreferencesService } from "@/lib/user-preferences"
import { SupabaseAuthService } from "@/lib/auth-supabase"
import type { AuthUser as User, Reminder } from "@/lib/auth-supabase"
import { SupabaseReminderService } from "@/lib/reminders-supabase"
import type { FavoriteQuote } from "@/lib/quotes-supabase"
import { SupabaseQuoteService } from "@/lib/quotes-supabase"
import { FriendsDashboard } from "@/components/friends/friends-dashboard"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>()
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  })
  const [favoriteQuotes, setFavoriteQuotes] = useState<FavoriteQuote[]>([])
  const router = useRouter()
  const analytics = useAnalytics()
  const notificationService = NotificationService.getInstance()
  const userPreferencesService = UserPreferencesService.getInstance()

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await SupabaseAuthService.getInstance().getCurrentUser()
      if (!currentUser) {
        router.push("/")
        return
      }

      setUser(currentUser)
      loadReminders(currentUser.id)
      setProfileData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        profileImage: currentUser.profileImage || "",
      })
      setLoading(false)

      // Load favorite quotes
      if (currentUser) {
        const quotes = await SupabaseQuoteService.getInstance().getFavoriteQuotes(currentUser.id)
        setFavoriteQuotes(quotes.slice(0, 3)) // Show only top 3
      }

      // Initialize notifications
      await notificationService.initialize()
    }

    loadUser()
  }, [router])

  const loadReminders = async (userId: string) => {
    try {
      const userReminders = await SupabaseReminderService.getInstance().getReminders(userId)
      setReminders(userReminders)
    } catch (error) {
      console.error("Error loading reminders:", error)
    }
  }

  const handleLogout = async () => {
    // Cancel all scheduled notifications on logout
    notificationService.cancelAllScheduledNotifications()
    await SupabaseAuthService.getInstance().signOut()
    router.push("/")
  }

  const handleSaveReminder = async (reminderData: Omit<Reminder, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return

    try {
      let savedReminder: Reminder

      if (editingReminder) {
        savedReminder = await SupabaseReminderService.getInstance().updateReminder(
          user.id,
          editingReminder.id,
          reminderData,
        )
        Analytics.trackReminderEdited()

        // Cancel old notification and schedule new one if needed
        notificationService.cancelScheduledNotification(`reminder-${editingReminder.id}`)
      } else {
        savedReminder = await SupabaseReminderService.getInstance().createReminder(user.id, reminderData)
        const reminderType = reminderData.image ? "image" : reminderData.location ? "location" : "text"
        Analytics.trackReminderCreated(reminderType)
      }

      // Schedule notification if reminder has a scheduled time and is active
      if (savedReminder.scheduledTime && savedReminder.isActive) {
        await notificationService.scheduleReminderNotification({
          id: savedReminder.id,
          title: savedReminder.title,
          description: savedReminder.description,
          scheduledTime: savedReminder.scheduledTime,
        })
      }

      loadReminders(user.id)
      setShowReminderForm(false)
      setEditingReminder(undefined)
    } catch (error) {
      console.error("Error saving reminder:", error)
    }
  }

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setShowReminderForm(true)
  }

  const handleDeleteReminder = async (reminderId: string) => {
    if (!user) return
    try {
      await SupabaseReminderService.getInstance().deleteReminder(user.id, reminderId)

      // Cancel scheduled notification
      notificationService.cancelScheduledNotification(`reminder-${reminderId}`)

      Analytics.trackReminderDeleted()
      loadReminders(user.id)
    } catch (error) {
      console.error("Error deleting reminder:", error)
    }
  }

  const handleToggleReminder = async (reminderId: string) => {
    if (!user) return
    try {
      const reminder = reminders.find((r) => r.id === reminderId)
      if (reminder) {
        const updatedReminder = await SupabaseReminderService.getInstance().toggleReminder(user.id, reminderId)

        if (updatedReminder.isActive && updatedReminder.scheduledTime) {
          // Schedule notification for activated reminder
          await notificationService.scheduleReminderNotification({
            id: updatedReminder.id,
            title: updatedReminder.title,
            description: updatedReminder.description,
            scheduledTime: updatedReminder.scheduledTime,
          })
        } else {
          // Cancel notification for deactivated reminder
          notificationService.cancelScheduledNotification(`reminder-${reminderId}`)
        }

        Analytics.trackReminderToggled(updatedReminder.isActive)
        loadReminders(user.id)
      }
    } catch (error) {
      console.error("Error toggling reminder:", error)
    }
  }

  const handleShareReminder = (reminder: Reminder) => {
    const shareText = `${reminder.title}${reminder.description ? "\n" + reminder.description : ""}`
    if (navigator.share) {
      navigator.share({
        title: "Reminder from MindReMinder",
        text: shareText,
      })
      Analytics.trackReminderShared("native_share")
    } else {
      navigator.clipboard.writeText(shareText)
      Analytics.trackReminderShared("copy_link")
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const updatedUser = await SupabaseAuthService.getInstance().updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        profileImage: profileData.profileImage,
      })
      setUser(updatedUser)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleProfileImageChange = async (imageUrl: string) => {
    if (!user) return

    try {
      const updatedUser = await SupabaseAuthService.getInstance().updateProfile({
        profileImage: imageUrl,
      })
      setUser(updatedUser)
      setProfileData((prev) => ({ ...prev, profileImage: imageUrl }))
    } catch (error) {
      console.error("Error updating profile image:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-sm">MR</span>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const activeReminders = reminders.filter((r) => r.isActive)
  const upcomingReminders = reminders
    .filter((r) => r.isActive && r.scheduledTime && new Date(r.scheduledTime) > new Date())
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        onProfileClick={() => setActiveTab("settings")}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            Analytics.trackTabChange(tab)
            setActiveTab(tab)
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-6 md:ml-0">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Welcome back, {user.firstName}!</h2>
                <p className="text-muted-foreground">Here's what's happening with your reminders</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reminders</CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reminders.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Reminders</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeReminders.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                    <Quote className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{upcomingReminders.length}</div>
                  </CardContent>
                </Card>
              </div>

              {favoriteQuotes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Quote className="h-5 w-5" />
                        Recent Favorite Quotes
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          Analytics.trackTabChange("quotes")
                          setActiveTab("quotes")
                        }}
                      >
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {favoriteQuotes.map((quote) => (
                        <div key={quote.id} className="p-3 border rounded-lg bg-muted/30">
                          <p className="text-sm italic mb-1">"{quote.content}"</p>
                          <p className="text-xs text-muted-foreground">— {quote.author}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {upcomingReminders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Reminders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingReminders.map((reminder) => (
                        <div key={reminder.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{reminder.title}</h4>
                            {reminder.scheduledTime && (
                              <p className="text-sm text-muted-foreground">
                                {userPreferencesService.formatDateTime(new Date(reminder.scheduledTime))}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "reminders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Reminders</h2>
                <Button onClick={() => setShowReminderForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Reminder
                </Button>
              </div>

              {showReminderForm ? (
                <ReminderForm
                  reminder={editingReminder}
                  onSave={handleSaveReminder}
                  onCancel={() => {
                    setShowReminderForm(false)
                    setEditingReminder(undefined)
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onEdit={handleEditReminder}
                      onDelete={handleDeleteReminder}
                      onToggle={handleToggleReminder}
                      onShare={handleShareReminder}
                    />
                  ))}
                  {reminders.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No reminders yet</h3>
                      <p className="text-muted-foreground mb-4">Create your first reminder to get started</p>
                      <Button onClick={() => setShowReminderForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Reminder
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "quotes" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">AI Quotes</h2>
              <QuoteGenerator user={user} />
            </div>
          )}

          {activeTab === "friends" && <FriendsDashboard user={user} />}

          {activeTab === "analytics" && <AnalyticsDashboard user={user} />}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Settings</h2>

              {/* Profile Image Upload */}
              <ProfileImageUpload
                currentImage={user.profileImage}
                userName={`${user.firstName} ${user.lastName}`}
                onImageChange={handleProfileImageChange}
              />

              {/* Profile Information */}
              <Card className="max-w-2xl">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.firstName} />
                        <AvatarFallback className="text-lg">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileData.email} disabled className="bg-muted" />
                    </div>

                    <Button type="submit">Update Profile</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Date & Time Preferences */}
              <UserPreferencesCard />

              {/* Notification Settings */}
              <NotificationSettingsCard />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
