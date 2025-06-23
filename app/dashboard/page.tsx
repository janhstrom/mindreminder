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
      setLoading(true)

      // Check if user is already authenticated
      const currentUser = await authService.getCurrentUser()

      if (!currentUser) {
        // Redirect to home page if not authenticated
        router.push("/")
        return
      }

      setUser(currentUser)
      await loadDashboardData(currentUser)

      // Listen for auth state changes
      authService.onAuthStateChange((user) => {
        if (!user) {
          router.push("/")
        } else {
          setUser(user)
          loadDashboardData(user)
        }
      })
    } catch (error) {
      console.error("Auth initialization error:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async (currentUser: AuthUser) => {
    try {
      console.log("Loading dashboard data for user:", currentUser.id)

      // Load reminders and micro-actions in parallel
      const [userReminders, userMicroActions, microActionStats] = await Promise.all([
        getReminders(currentUser.id),
        microActionService.getMicroActions(currentUser.id),
        microActionService.getMicroActionStats(currentUser.id),
      ])

      setReminders(userReminders || [])
      setMicroActions(userMicroActions || [])
      setStats(microActionStats)

      console.log("Dashboard loaded successfully")
    } catch (err) {
      console.error("Error loading dashboard:", err)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Loading MindReMinder...</h2>
            <p className="text-muted-foreground">Setting up your personal reminder space</p>
          </div>
        </div>
      </div>
    )
  }

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
                <h1 className="text-3xl font-bold">Welcome back, {user.firstName}! ✨</h1>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Today's Micro-Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2 text-primary" />
                        Today's Micro-Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {microActions.map((action) => (
                        <MicroActionCard
                          key={action.id}
                          microAction={action}
                          onComplete={handleMicroActionComplete}
                          onEdit={handleMicroActionEdit}
                          onDelete={handleMicroActionDelete}
                        />
                      ))}
                    </CardContent>
                  </Card>

                  {/* Progress & Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                        Your Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Weekly Goal</span>
                          <span className="text-sm text-muted-foreground">
                            {stats.weeklyCompletions}/{totalMicroActions * 7} actions
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (stats.weeklyCompletions / (totalMicroActions * 7)) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-primary mt-1">
                          {Math.round((stats.weeklyCompletions / (totalMicroActions * 7)) * 100)}% complete - keep it
                          up!
                        </p>
                      </div>

                      <div className="bg-primary/10 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">🎯 Habit Insight</h3>
                        <p className="text-sm">
                          {maxStreak > 0
                            ? `Amazing! Your best streak is ${maxStreak} days. Consistency is building your habits!`
                            : "Start your first micro-action today to begin building momentum!"}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Quick Micro-Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-auto p-3 text-left"
                            onClick={() => setShowMicroActionForm(true)}
                          >
                            <div>
                              <div className="font-medium text-xs">💧 Hydration</div>
                              <div className="text-xs text-muted-foreground">30 sec</div>
                            </div>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-auto p-3 text-left"
                            onClick={() => setShowMicroActionForm(true)}
                          >
                            <div>
                              <div className="font-medium text-xs">📚 Learning</div>
                              <div className="text-xs text-muted-foreground">2 min</div>
                            </div>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-auto p-3 text-left"
                            onClick={() => setShowMicroActionForm(true)}
                          >
                            <div>
                              <div className="font-medium text-xs">🧘 Mindfulness</div>
                              <div className="text-xs text-muted-foreground">1 min</div>
                            </div>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-auto p-3 text-left"
                            onClick={() => setShowMicroActionForm(true)}
                          >
                            <div>
                              <div className="font-medium text-xs">💪 Movement</div>
                              <div className="text-xs text-muted-foreground">30 sec</div>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Habit Categories */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🌱</div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">Health</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">Physical wellness</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🧠</div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Learning</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Knowledge & skills</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🧘</div>
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200">Mindfulness</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Mental clarity</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Productivity</h3>
                    <p className="text-sm text-orange-600 dark:text-orange-400">Getting things done</p>
                  </CardContent>
                </Card>
              </div>
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
