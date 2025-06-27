"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Target, CheckCircle, Clock, TrendingUp, Bell, Sparkles, QuoteIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuoteGenerator } from "@/components/quotes/quote-generator"
import { CreateReminderModal } from "@/components/reminders/create-reminder-modal"
import { CreateMicroActionModal } from "@/components/micro-actions/create-micro-action-modal"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/dashboard/sidebar"

interface ReminderFormData {
  title: string
  description?: string
  scheduledTime?: string
  isActive: boolean
}

interface MicroActionFormData {
  title: string
  description?: string
  category: string
  duration: string
  frequency: string
  isActive: boolean
}

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

interface UserProfile {
  id: string
  email?: string
  user_metadata?: {
    firstName?: string
    lastName?: string
    profileImage?: string
  }
}

interface DashboardClientContentProps {
  user: UserProfile
}

export function DashboardClientContent({ user }: DashboardClientContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showMicroActionModal, setShowMicroActionModal] = useState(false)
  const [reminders, setReminders] = useState<SafeReminder[]>([])
  const [microActions, setMicroActions] = useState<SafeMicroAction[]>([])
  const [activeTab, setActiveTab] = useState("inspiration")

  useEffect(() => {
    if (user) {
      try {
        const savedReminders = localStorage.getItem(`reminders_${user.id}`)
        if (savedReminders) setReminders(JSON.parse(savedReminders))

        const savedMicroActions = localStorage.getItem(`microActions_${user.id}`)
        if (savedMicroActions) setMicroActions(JSON.parse(savedMicroActions))
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
        setReminders([])
        setMicroActions([])
      }
    }
  }, [user])

  const handleReminderCreated = (data: ReminderFormData) => {
    if (!user) return
    const newReminder: SafeReminder = {
      id: Date.now().toString(),
      ...data,
      completed: false,
      createdAt: new Date().toISOString(),
      userId: user.id,
    }
    const updatedReminders = [...reminders, newReminder]
    setReminders(updatedReminders)
    localStorage.setItem(`reminders_${user.id}`, JSON.stringify(updatedReminders))
    setShowReminderModal(false)
  }

  const handleMicroActionCreated = (data: MicroActionFormData) => {
    if (!user) return
    const newMicroAction: SafeMicroAction = {
      id: Date.now().toString(),
      ...data,
      currentStreak: 0,
      bestStreak: 0,
      completedToday: false,
      createdAt: new Date().toISOString(),
      userId: user.id,
    }
    const updatedMicroActions = [...microActions, newMicroAction]
    setMicroActions(updatedMicroActions)
    localStorage.setItem(`microActions_${user.id}`, JSON.stringify(updatedMicroActions))
    setShowMicroActionModal(false)
  }

  const stats = {
    activeReminders: reminders.filter((r) => r.isActive).length,
    activeHabits: microActions.filter((m) => m.isActive).length,
    bestStreak: Math.max(0, ...microActions.map((m) => m.bestStreak)),
    completedToday: microActions.filter((m) => m.completedToday).length,
  }

  return (
    <div className="flex w-full">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={cn("flex-1 p-6 transition-all duration-300", sidebarOpen ? "md:ml-64" : "ml-0")}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.user_metadata?.firstName || "User"}!
            </h1>
            <p className="text-muted-foreground">Ready to build some amazing habits today?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center">
                <Bell className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Reminders</p>
                  <p className="text-2xl font-bold">{stats.activeReminders}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center">
                <Target className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Habits</p>
                  <p className="text-2xl font-bold">{stats.activeHabits}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Best Streak</p>
                  <p className="text-2xl font-bold">{stats.bestStreak}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">{stats.completedToday}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card shadow-sm">
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
                <QuoteIcon className="h-4 w-4 mr-2" />
                Quote Generator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inspiration">
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-900 dark:text-orange-100">
                    <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                    Today's Inspiration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-background/70 backdrop-blur-sm p-6 rounded-xl">
                    <blockquote className="text-lg italic text-center mb-4">
                      "The journey of a thousand miles begins with one step."
                    </blockquote>
                    <footer className="text-center text-sm text-muted-foreground">— Lao Tzu</footer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reminders" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Your Reminders</h2>
                  <p className="text-muted-foreground">{stats.activeReminders} active reminders</p>
                </div>
                <Button onClick={() => setShowReminderModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </div>
              {reminders.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {reminders.map((reminder) => (
                    <Card key={reminder.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{reminder.title}</h3>
                            {reminder.description && (
                              <p className="text-sm text-muted-foreground mb-2">{reminder.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(reminder.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full mt-1 ${
                              reminder.isActive ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Reminders Yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first reminder.</p>
                    <Button onClick={() => setShowReminderModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Reminder
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="habits" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Habit Builder</h2>
                  <p className="text-muted-foreground">{stats.activeHabits} active micro-actions</p>
                </div>
                <Button onClick={() => setShowMicroActionModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Micro-Action
                </Button>
              </div>
              {microActions.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {microActions.map((action) => (
                    <Card key={action.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{action.title}</h3>
                              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                {action.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                          <Button size="sm" variant="outline">
                            Mark Done
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Habits Yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first micro-action.</p>
                    <Button onClick={() => setShowMicroActionModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Habit
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="quotes">
              <QuoteGenerator user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
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
