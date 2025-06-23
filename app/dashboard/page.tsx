"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Quote, Bell, Heart, Sparkles, Target, TrendingUp, Zap } from "lucide-react"
import { QuoteGenerator } from "@/components/quotes/quote-generator"
import { ReminderForm } from "@/components/reminders/reminder-form"
import { ReminderCard } from "@/components/reminders/reminder-card"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { authService, type AuthUser } from "@/lib/auth-supabase"
import { getReminders } from "@/lib/reminders-supabase"
import { microActionService, type MicroAction } from "@/lib/micro-actions-service"
import type { Reminder } from "@/types"
import { MicroActionForm } from "@/components/micro-actions/micro-action-form"
import { MicroActionCard } from "@/components/micro-actions/micro-action-card"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [microActions, setMicroActions] = useState<MicroAction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("inspiration")
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [showMicroActionForm, setShowMicroActionForm] = useState(false)
  const [stats, setStats] = useState({
    totalActive: 0,
    completedToday: 0,
    currentStreaks: [] as number[],
    weeklyCompletions: 0,
  })

  const router = useRouter()

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      console.log("🔍 Starting auth initialization...")
      setLoading(true)
      setError(null)

      // Check if user is already authenticated
      console.log("🔍 Checking current user...")
      const currentUser = await authService.getCurrentUser()
      console.log("🔍 Current user result:", currentUser)

      if (!currentUser) {
        console.log("❌ No authenticated user found, redirecting to home")
        router.push("/")
        return
      }

      console.log("✅ User authenticated:", currentUser.email)
      setUser(currentUser)

      console.log("🔍 Loading dashboard data...")
      await loadDashboardData(currentUser)

      // Listen for auth state changes
      console.log("🔍 Setting up auth state listener...")
      authService.onAuthStateChange((user) => {
        console.log("🔍 Auth state changed:", user?.email || "null")
        if (!user) {
          console.log("❌ User logged out, redirecting to home")
          router.push("/")
        } else {
          setUser(user)
          loadDashboardData(user)
        }
      })

      console.log("✅ Auth initialization complete")
    } catch (error) {
      console.error("❌ Auth initialization error:", error)
      setError(error instanceof Error ? error.message : "Authentication failed")
      // Don't redirect on error, show error state instead
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async (currentUser: AuthUser) => {
    try {
      console.log("🔍 Loading dashboard data for user:", currentUser.id)

      // Load reminders and micro-actions in parallel
      const [userReminders, userMicroActions, microActionStats] = await Promise.all([
        getReminders(currentUser.id).catch((err) => {
          console.error("❌ Error loading reminders:", err)
          return []
        }),
        microActionService.getMicroActions(currentUser.id).catch((err) => {
          console.error("❌ Error loading micro-actions:", err)
          return []
        }),
        microActionService.getMicroActionStats(currentUser.id).catch((err) => {
          console.error("❌ Error loading stats:", err)
          return { totalActive: 0, completedToday: 0, currentStreaks: [], weeklyCompletions: 0 }
        }),
      ])

      setReminders(userReminders || [])
      setMicroActions(userMicroActions || [])
      setStats(microActionStats)

      console.log("✅ Dashboard data loaded successfully")
      console.log("📊 Stats:", { reminders: userReminders?.length, microActions: userMicroActions?.length })
    } catch (err) {
      console.error("❌ Error loading dashboard:", err)
      setError("Failed to load dashboard data")
    }
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleProfileClick = () => {
    router.push("/settings")
  }

  const handleReminderAdded = () => {
    setShowReminderForm(false)
    if (user) loadDashboardData(user)
  }

  const handleMicroActionAdded = async (microActionData: any) => {
    try {
      if (!user) return

      await microActionService.createMicroAction(user.id, microActionData)
      setShowMicroActionForm(false)
      loadDashboardData(user) // Reload to show new micro-action
    } catch (error) {
      console.error("Error creating micro-action:", error)
    }
  }

  const handleMicroActionComplete = async (id: string) => {
    try {
      if (!user) return

      const action = microActions.find((a) => a.id === id)
      if (!action) return

      if (action.completedToday) {
        // Uncomplete
        await microActionService.uncompleteMicroAction(user.id, id)
      } else {
        // Complete
        await microActionService.completeMicroAction(user.id, id)
      }

      // Reload data to get updated streaks and stats
      loadDashboardData(user)
    } catch (error) {
      console.error("Error updating micro-action completion:", error)
    }
  }

  const handleMicroActionEdit = (microAction: MicroAction) => {
    // TODO: Implement edit functionality
    console.log("Edit micro-action:", microAction)
  }

  const handleMicroActionDelete = async (id: string) => {
    try {
      if (!user) return

      await microActionService.deleteMicroAction(user.id, id)
      loadDashboardData(user) // Reload to remove deleted action
    } catch (error) {
      console.error("Error deleting micro-action:", error)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Loading MindReMinder...</h2>
            <p className="text-muted-foreground">Setting up your personal reminder space</p>
            <p className="text-xs text-muted-foreground">Check browser console for debug info</p>
          </div>
          {/* Emergency bypass button for debugging */}
          <Button
            variant="outline"
            onClick={() => {
              console.log("🚨 Emergency bypass activated")
              setLoading(false)
              setError("Debug mode - check console")
            }}
            className="mt-4"
          >
            Debug Mode (Emergency)
          </Button>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-xl font-semibold text-destructive">Authentication Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="space-y-2">
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setError(null)
                setLoading(true)
                initializeAuth()
              }}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Check browser console for more details</p>
        </div>
      </div>
    )
  }

  // Show auth required state
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to access your dashboard</p>
          <Button onClick={() => router.push("/")}>Go to Sign In</Button>
        </div>
      </div>
    )
  }

  const maxStreak = Math.max(...stats.currentStreaks, 0)
  const totalMicroActions = stats.totalActive

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <Header
          user={user}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user.firstName || user.email}! ✨</h1>
                <p className="text-muted-foreground mt-2">Your personal space for inspiration and habit building</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowReminderForm(true)} variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  New Reminder
                </Button>
                <Button onClick={() => setShowMicroActionForm(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  New Micro-Action
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Reminders</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reminders.filter((r) => r.isActive).length}</div>
                <p className="text-xs text-muted-foreground">keeping you inspired</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMicroActions}</div>
                <p className="text-xs text-muted-foreground">micro-actions building</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maxStreak}</div>
                <p className="text-xs text-muted-foreground">days strong</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.completedToday}/{totalMicroActions}
                </div>
                <p className="text-xs text-muted-foreground">micro-actions done</p>
              </CardContent>
            </Card>
          </div>

          {/* Debug Info */}
          <div className="mb-4 p-4 bg-muted/50 rounded-lg text-sm">
            <p>
              <strong>Debug Info:</strong>
            </p>
            <p>User ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Reminders: {reminders.length}</p>
            <p>Micro-actions: {microActions.length}</p>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="inspiration" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Daily Inspiration
              </TabsTrigger>
              <TabsTrigger value="reminders" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                My Reminders
              </TabsTrigger>
              <TabsTrigger value="habits" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Habit Builder
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <Quote className="h-4 w-4" />
                Quote Generator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inspiration" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Inspiration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                      Today's Inspiration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
                      <blockquote className="text-lg italic text-center mb-4">
                        "The journey of a thousand miles begins with one step."
                      </blockquote>
                      <footer className="text-center text-sm text-muted-foreground">— Lao Tzu</footer>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Heart className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Quote className="h-4 w-4 mr-1" />
                        New Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Reminders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                      onClick={() => setShowReminderForm(true)}
                    >
                      <div className="text-left">
                        <div className="font-medium">💭 Daily Affirmation</div>
                        <div className="text-sm text-muted-foreground">Remind me to practice self-love</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                      onClick={() => setShowReminderForm(true)}
                    >
                      <div className="text-left">
                        <div className="font-medium">🌅 Morning Motivation</div>
                        <div className="text-sm text-muted-foreground">Start my day with intention</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                      onClick={() => setShowReminderForm(true)}
                    >
                      <div className="text-left">
                        <div className="font-medium">🙏 Gratitude Moment</div>
                        <div className="text-sm text-muted-foreground">Pause and appreciate</div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reminders" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Your Reminders</h2>
                  <p className="text-muted-foreground">Gentle nudges for what matters to you</p>
                </div>
                <Button onClick={() => setShowReminderForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reminders.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first gentle reminder</p>
                    <Button onClick={() => setShowReminderForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Reminder
                    </Button>
                  </div>
                ) : (
                  reminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onUpdate={() => user && loadDashboardData(user)}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="habits" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Habit Builder</h2>
                  <p className="text-muted-foreground">Build lasting habits through tiny daily actions</p>
                </div>
                <Button onClick={() => setShowMicroActionForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Micro-Action
                </Button>
              </div>

              {microActions.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No micro-actions yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first tiny habit to get started</p>
                  <Button onClick={() => setShowMicroActionForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Micro-Action
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {microActions.map((action) => (
                    <MicroActionCard
                      key={action.id}
                      microAction={action}
                      onComplete={handleMicroActionComplete}
                      onEdit={handleMicroActionEdit}
                      onDelete={handleMicroActionDelete}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="quotes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Quote className="h-5 w-5 mr-2" />
                    AI Quote Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <QuoteGenerator user={user} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Reminder Form Modal */}
          {showReminderForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <ReminderForm onSave={handleReminderAdded} onCancel={() => setShowReminderForm(false)} />
              </div>
            </div>
          )}

          {/* Micro-Action Form Modal */}
          {showMicroActionForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <MicroActionForm onSave={handleMicroActionAdded} onCancel={() => setShowMicroActionForm(false)} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
