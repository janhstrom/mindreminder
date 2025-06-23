"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Quote, Bell, Heart, Sparkles, Target, TrendingUp, Zap } from "lucide-react"
import { QuoteGenerator } from "@/components/quotes/quote-generator"
import { ReminderForm } from "@/components/reminders/reminder-form"
import { ReminderCard } from "@/components/reminders/reminder-card"
import { getUser } from "@/lib/auth-fallback"
import { getReminders } from "@/lib/reminders"
import { microActionService, type MicroAction } from "@/lib/micro-actions-service"
import type { User, Reminder } from "@/types"
import { MicroActionForm } from "@/components/micro-actions/micro-action-form"
import { MicroActionCard } from "@/components/micro-actions/micro-action-card"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [microActions, setMicroActions] = useState<MicroAction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("inspiration")
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [showMicroActionForm, setShowMicroActionForm] = useState(false)
  const [stats, setStats] = useState({
    totalActive: 0,
    completedToday: 0,
    currentStreaks: [] as number[],
    weeklyCompletions: 0,
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log("Loading dashboard data...")
      setLoading(true)

      // Get current user (fallback to test user for now)
      const currentUser = await getUser()
      if (!currentUser) {
        window.location.href = "/"
        return
      }

      setUser(currentUser)

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
    } finally {
      setLoading(false)
    }
  }

  const handleReminderAdded = () => {
    setShowReminderForm(false)
    loadDashboardData()
  }

  const handleMicroActionAdded = async (microActionData: any) => {
    try {
      if (!user) return

      await microActionService.createMicroAction(user.id, microActionData)
      setShowMicroActionForm(false)
      loadDashboardData()
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
        await microActionService.uncompleteMicroAction(user.id, id)
      } else {
        await microActionService.completeMicroAction(user.id, id)
      }

      loadDashboardData()
    } catch (error) {
      console.error("Error updating micro-action completion:", error)
    }
  }

  const handleMicroActionEdit = (microAction: MicroAction) => {
    console.log("Edit micro-action:", microAction)
  }

  const handleMicroActionDelete = async (id: string) => {
    try {
      if (!user) return

      await microActionService.deleteMicroAction(user.id, id)
      loadDashboardData()
    } catch (error) {
      console.error("Error deleting micro-action:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Loading MindReMinder...</h2>
            <p className="text-gray-600">Setting up your personal reminder space</p>
          </div>
        </div>
      </div>
    )
  }

  const maxStreak = Math.max(...stats.currentStreaks, 0)
  const totalMicroActions = stats.totalActive

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || "Friend"}! ✨</h1>
              <p className="text-gray-600 mt-2">Your personal space for inspiration and habit building</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowReminderForm(true)}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Bell className="h-4 w-4 mr-2" />
                New Reminder
              </Button>
              <Button onClick={() => setShowMicroActionForm(true)} className="bg-purple-600 hover:bg-purple-700">
                <Target className="h-4 w-4 mr-2" />
                New Micro-Action
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Reminders</CardTitle>
              <Bell className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{reminders.filter((r) => r.isActive).length}</div>
              <p className="text-xs text-blue-600">keeping you inspired</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Habits</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalMicroActions}</div>
              <p className="text-xs text-purple-600">micro-actions building</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Best Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{maxStreak}</div>
              <p className="text-xs text-orange-600">days strong</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Today</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.completedToday}/{totalMicroActions}
              </div>
              <p className="text-xs text-green-600">micro-actions done</p>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                    Today's Inspiration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                    <blockquote className="text-lg italic text-center mb-4">
                      "The journey of a thousand miles begins with one step."
                    </blockquote>
                    <footer className="text-center text-sm text-gray-600">— Lao Tzu</footer>
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
                      <div className="text-sm text-gray-500">Remind me to practice self-love</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => setShowReminderForm(true)}
                  >
                    <div className="text-left">
                      <div className="font-medium">🌅 Morning Motivation</div>
                      <div className="text-sm text-gray-500">Start my day with intention</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => setShowReminderForm(true)}
                  >
                    <div className="text-left">
                      <div className="font-medium">🙏 Gratitude Moment</div>
                      <div className="text-sm text-gray-500">Pause and appreciate</div>
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
                <p className="text-gray-600">Gentle nudges for what matters to you</p>
              </div>
              <Button onClick={() => setShowReminderForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
                  <p className="text-gray-600 mb-4">Create your first gentle reminder</p>
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

          <TabsContent value="habits" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Habit Builder</h2>
                <p className="text-gray-600">Build lasting habits through tiny daily actions</p>
              </div>
              <Button onClick={() => setShowMicroActionForm(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Micro-Action
              </Button>
            </div>

            {microActions.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No micro-actions yet</h3>
                <p className="text-gray-600 mb-4">Create your first tiny habit to get started</p>
                <Button onClick={() => setShowMicroActionForm(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Micro-Action
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-purple-600" />
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                      Your Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Weekly Goal</span>
                        <span className="text-sm text-gray-600">
                          {stats.weeklyCompletions}/{totalMicroActions * 7} actions
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (stats.weeklyCompletions / (totalMicroActions * 7)) * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-purple-600 mt-1">
                        {Math.round((stats.weeklyCompletions / (totalMicroActions * 7)) * 100)}% complete - keep it up!
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">🎯 Habit Insight</h3>
                      <p className="text-purple-800 text-sm">
                        {maxStreak > 0
                          ? `Amazing! Your best streak is ${maxStreak} days. Consistency is building your habits!`
                          : "Start your first micro-action today to begin building momentum!"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Quote className="h-5 w-5 mr-2 text-blue-600" />
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
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <ReminderForm onSave={handleReminderAdded} onCancel={() => setShowReminderForm(false)} />
            </div>
          </div>
        )}

        {/* Micro-Action Form Modal */}
        {showMicroActionForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <MicroActionForm onSave={handleMicroActionAdded} onCancel={() => setShowMicroActionForm(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
