"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Target, CheckCircle, Clock, TrendingUp, Bell, Sparkles, Quote } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { CreateReminderModal } from "@/components/reminders/create-reminder-modal"
import { CreateMicroActionModal } from "@/components/micro-actions/create-micro-action-modal"
import { useAuth } from "@/components/auth/auth-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface SafeReminder {
  id: string
  title: string
  description?: string
  scheduledTime?: string
  isActive: boolean
  completed: boolean
  createdAt: string
  userId?: string
}

interface SafeMicroAction {
  id: string
  title: string
  description?: string
  category: string
  duration: string
  frequency: string
  isActive: boolean
  currentStreak: number
  bestStreak: number
  completedToday: boolean
  createdAt: string
  userId?: string
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showMicroActionModal, setShowMicroActionModal] = useState(false)
  const [reminders, setReminders] = useState<SafeReminder[]>([])
  const [microActions, setMicroActions] = useState<SafeMicroAction[]>([])
  const [activeTab, setActiveTab] = useState("inspiration")
  // Remove dataLoading state - not needed

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log("No user, redirecting to login")
      router.push("/login")
    }
  }, [user, loading, router])

  // Load data from localStorage safely
  useEffect(() => {
    if (user) {
      try {
        const savedReminders = localStorage.getItem(`reminders_${user.id}`)
        const savedMicroActions = localStorage.getItem(`microActions_${user.id}`)

        if (savedReminders) {
          const parsed = JSON.parse(savedReminders)
          // Filter out null/undefined items and ensure required properties
          const safeReminders = (Array.isArray(parsed) ? parsed : [])
            .filter((item) => item && typeof item === "object" && item.title)
            .map((item) => ({
              id: item.id || Date.now().toString(),
              title: item.title || "Untitled",
              description: item.description || undefined,
              scheduledTime: item.scheduledTime || undefined,
              isActive: Boolean(item.isActive),
              completed: Boolean(item.completed),
              createdAt: item.createdAt || new Date().toISOString(),
              userId: user.id,
            }))
          setReminders(safeReminders)
        }

        if (savedMicroActions) {
          const parsed = JSON.parse(savedMicroActions)
          // Filter out null/undefined items and ensure required properties
          const safeMicroActions = (Array.isArray(parsed) ? parsed : [])
            .filter((item) => item && typeof item === "object" && item.title)
            .map((item) => ({
              id: item.id || Date.now().toString(),
              title: item.title || "Untitled",
              description: item.description || undefined,
              category: item.category || "General",
              duration: item.duration || "5 minutes",
              frequency: item.frequency || "Daily",
              isActive: Boolean(item.isActive),
              currentStreak: Number(item.currentStreak) || 0,
              bestStreak: Number(item.bestStreak) || 0,
              completedToday: Boolean(item.completedToday),
              createdAt: item.createdAt || new Date().toISOString(),
              userId: user.id,
            }))
          setMicroActions(safeMicroActions)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        // Reset to empty arrays on error
        setReminders([])
        setMicroActions([])
      }
    }
  }, [user])

  const handleReminderCreated = (reminderData: any) => {
    if (!user || !reminderData || !reminderData.title) {
      console.error("Invalid reminder data or no user")
      return
    }

    const newReminder: SafeReminder = {
      id: Date.now().toString(),
      title: reminderData.title,
      description: reminderData.description || undefined,
      scheduledTime: reminderData.scheduledTime || undefined,
      isActive: true,
      completed: false,
      createdAt: new Date().toISOString(),
      userId: user.id,
    }

    const newReminders = [...reminders, newReminder]
    setReminders(newReminders)

    try {
      localStorage.setItem(`reminders_${user.id}`, JSON.stringify(newReminders))
    } catch (error) {
      console.error("Error saving reminders:", error)
    }

    setShowReminderModal(false)
  }

  const handleMicroActionCreated = (actionData: any) => {
    if (!user || !actionData || !actionData.title) {
      console.error("Invalid micro-action data or no user")
      return
    }

    const newMicroAction: SafeMicroAction = {
      id: Date.now().toString(),
      title: actionData.title,
      description: actionData.description || undefined,
      category: actionData.category || "General",
      duration: actionData.duration || "5 minutes",
      frequency: actionData.frequency || "Daily",
      isActive: true,
      currentStreak: 0,
      bestStreak: 0,
      completedToday: false,
      createdAt: new Date().toISOString(),
      userId: user.id,
    }

    const newMicroActions = [...microActions, newMicroAction]
    setMicroActions(newMicroActions)

    try {
      localStorage.setItem(`microActions_${user.id}`, JSON.stringify(newMicroActions))
    } catch (error) {
      console.error("Error saving micro-actions:", error)
    }

    setShowMicroActionModal(false)
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect even if logout fails
      window.location.href = "/"
    }
  }

  // Show loading only while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if no user (will redirect)
  if (!user) {
    return null
  }

  const stats = {
    activeReminders: reminders.filter((r) => r && r.isActive).length,
    activeHabits: microActions.filter((m) => m && m.isActive).length,
    bestStreak: Math.max(...microActions.map((m) => m?.bestStreak || 0), 0),
    completedToday: microActions.filter((m) => m && m.completedToday).length,
    totalHabits: microActions.length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onLogout={handleLogout}
        onProfileClick={() => router.push("/settings")}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className={cn("flex-1 p-6 transition-all duration-300", sidebarOpen && "md:ml-64")}>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.firstName || "there"}!</h1>
              <p className="text-muted-foreground">Ready to build some amazing habits today?</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Bell className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Active Reminders</p>
                      <p className="text-2xl font-bold">{stats.activeReminders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Active Habits</p>
                      <p className="text-2xl font-bold">{stats.activeHabits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Best Streak</p>
                      <p className="text-2xl font-bold">{stats.bestStreak}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                      <p className="text-2xl font-bold">{stats.completedToday}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
                <TabsTrigger value="inspiration">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Daily Inspiration
                </TabsTrigger>
                <TabsTrigger value="reminders">
                  <Bell className="h-4 w-4 mr-2" />
                  My Reminders ({stats.activeReminders})
                </TabsTrigger>
                <TabsTrigger value="habits">
                  <Target className="h-4 w-4 mr-2" />
                  Habit Builder ({stats.activeHabits})
                </TabsTrigger>
                <TabsTrigger value="quotes">
                  <Quote className="h-4 w-4 mr-2" />
                  Quote Generator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inspiration" className="space-y-6">
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-900">
                      <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                      Today's Inspiration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl">
                      <blockquote className="text-lg italic text-center mb-4 text-gray-800">
                        "The journey of a thousand miles begins with one step."
                      </blockquote>
                      <footer className="text-center text-sm text-gray-600">— Lao Tzu</footer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reminders" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Reminders</h2>
                    <p className="text-gray-600">{stats.activeReminders} active reminders</p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={() => setShowReminderModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>

                {reminders.length > 0 ? (
                  <div className="grid gap-4">
                    {reminders
                      .filter((reminder) => reminder && reminder.title) // Extra safety check
                      .map((reminder) => (
                        <Card
                          key={reminder.id}
                          className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{reminder.title}</h3>
                                {reminder.description && (
                                  <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(reminder.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${reminder.isActive ? "bg-green-500" : "bg-gray-400"}`}
                                ></div>
                                <span className={`text-xs ${reminder.isActive ? "text-green-600" : "text-gray-500"}`}>
                                  {reminder.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card className="bg-white shadow-lg border-0">
                    <CardContent className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bell className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">No Reminders Yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Create your first reminder to get started with building better habits!
                      </p>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        onClick={() => setShowReminderModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Reminder
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="habits" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Habit Builder</h2>
                    <p className="text-gray-600">{stats.activeHabits} active micro-actions</p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => setShowMicroActionModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Micro-Action
                  </Button>
                </div>

                {microActions.length > 0 ? (
                  <div className="grid gap-4">
                    {microActions
                      .filter((action) => action && action.title) // Extra safety check
                      .map((action) => (
                        <Card key={action.id} className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                    {action.category}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="h-4 w-4" />
                                    {action.currentStreak} day streak
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {action.duration}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                              >
                                Mark Done
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card className="bg-white shadow-lg border-0">
                    <CardContent className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="h-10 w-10 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">No Habits Yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Create your first micro-action to start building lasting habits!
                      </p>
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => setShowMicroActionModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Habit
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="quotes">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-900">
                      <Quote className="h-5 w-5 mr-2 text-green-600" />
                      AI Quote Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                        <Quote className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-green-900">AI-Powered Inspiration</h3>
                      <p className="text-green-700 mb-6 max-w-md mx-auto">
                        Generate personalized quotes and affirmations tailored to your goals and current mood.
                      </p>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateReminderModal
        open={showReminderModal}
        onOpenChange={setShowReminderModal}
        onReminderCreated={handleReminderCreated}
      />

      <CreateMicroActionModal
        open={showMicroActionModal}
        onOpenChange={setShowMicroActionModal}
        onMicroActionCreated={handleMicroActionCreated}
      />
    </div>
  )
}
