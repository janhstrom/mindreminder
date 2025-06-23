"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Calendar, Users, BarChart3, Bell } from "lucide-react"
import { ReminderForm } from "@/components/reminders/reminder-form"
import { ReminderCard } from "@/components/reminders/reminder-card"
import { QuoteGenerator } from "@/components/quotes/quote-generator"
import { FriendsDashboard } from "@/components/friends/friends-dashboard"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { NotificationSettings } from "@/components/notifications/notification-settings"
import { UserPreferences } from "@/components/settings/user-preferences"
import { getUser } from "@/lib/auth-supabase"
import { getReminders } from "@/lib/reminders-supabase"
import { trackPageView, trackUserAction } from "@/lib/analytics-service"
import type { User, Reminder } from "@/types"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showReminderForm, setShowReminderForm] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log("Loading dashboard data...")
      setLoading(true)
      setError(null)

      // Get current user
      console.log("Getting user...")
      const currentUser = await getUser()
      console.log("User result:", currentUser)

      if (!currentUser) {
        console.log("No user found, redirecting to login")
        window.location.href = "/"
        return
      }

      setUser(currentUser)
      console.log("User set:", currentUser)

      // Get user's reminders
      console.log("Getting reminders for user:", currentUser.id)
      const userReminders = await getReminders(currentUser.id)
      console.log("Reminders result:", userReminders)

      setReminders(userReminders || [])

      // Track page view
      trackPageView("/dashboard", currentUser.id)

      console.log("Dashboard data loaded successfully")
    } catch (err) {
      console.error("Error loading dashboard:", err)
      setError(err instanceof Error ? err.message : "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    trackUserAction("tab_change", { tab: value }, user?.id)
  }

  const handleReminderAdded = () => {
    setShowReminderForm(false)
    loadDashboardData() // Reload to show new reminder
    trackUserAction("reminder_added", {}, user?.id)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading your dashboard...</p>
            <p className="text-sm text-muted-foreground">This should only take a moment</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500">
            <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="space-x-2">
            <Button onClick={loadDashboardData}>Try Again</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show dashboard
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your reminders</p>
          </div>
          <Button onClick={() => setShowReminderForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Reminder
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reminders</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reminders.length}</div>
              <p className="text-xs text-muted-foreground">{reminders.filter((r) => r.isActive).length} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  reminders.filter((r) => {
                    const reminderDate = new Date(r.scheduledFor)
                    const now = new Date()
                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                    return reminderDate >= now && reminderDate <= weekFromNow
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reminders.filter((r) => r.isCompleted).length}</div>
              <p className="text-xs text-muted-foreground">this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Friends</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Reminders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reminders</CardTitle>
                  <CardDescription>Your latest reminders and their status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reminders.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No reminders yet</p>
                      <Button variant="outline" className="mt-2" onClick={() => setShowReminderForm(true)}>
                        Create your first reminder
                      </Button>
                    </div>
                  ) : (
                    reminders
                      .slice(0, 3)
                      .map((reminder) => (
                        <ReminderCard key={reminder.id} reminder={reminder} onUpdate={loadDashboardData} />
                      ))
                  )}
                </CardContent>
              </Card>

              {/* Quote of the Day */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Inspiration</CardTitle>
                  <CardDescription>Get motivated with a daily quote</CardDescription>
                </CardHeader>
                <CardContent>
                  <QuoteGenerator />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your Reminders</h2>
                <p className="text-muted-foreground">Manage all your reminders in one place</p>
              </div>
              <Button onClick={() => setShowReminderForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first reminder to get started</p>
                  <Button onClick={() => setShowReminderForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Reminder
                  </Button>
                </div>
              ) : (
                reminders.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} onUpdate={loadDashboardData} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Quote Generator</CardTitle>
                <CardDescription>Generate inspiring quotes to motivate yourself</CardDescription>
              </CardHeader>
              <CardContent>
                <QuoteGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <FriendsDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive reminders</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettings />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserPreferences />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Reminder Form Modal */}
        {showReminderForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Create New Reminder</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowReminderForm(false)}>
                  ✕
                </Button>
              </div>
              <ReminderForm onSuccess={handleReminderAdded} onCancel={() => setShowReminderForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
