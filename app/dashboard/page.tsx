"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Quote,
  Bell,
  Heart,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  ArrowLeft,
  Clock,
  Calendar,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { CreateReminderModal } from "@/components/reminders/create-reminder-modal"
import { CreateMicroActionModal } from "@/components/micro-actions/create-micro-action-modal"
import { simpleDataService } from "@/lib/simple-data-service"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("inspiration")
  const [stats, setStats] = useState({
    activeReminders: 0,
    activeHabits: 0,
    bestStreak: 0,
    completedToday: 0,
    totalHabits: 0,
  })
  const [reminders, setReminders] = useState<any[]>([])
  const [microActions, setMicroActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showMicroActionModal, setShowMicroActionModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsData, remindersData, microActionsData] = await Promise.all([
        simpleDataService.getStats(),
        simpleDataService.getReminders(),
        simpleDataService.getMicroActions(),
      ])

      setStats(statsData)
      setReminders(remindersData)
      setMicroActions(microActionsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReminderCreated = () => {
    setShowReminderModal(false)
    loadData()
  }

  const handleMicroActionCreated = () => {
    setShowMicroActionModal(false)
    loadData()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to MindReMinder! ✨
              </h1>
              <p className="text-gray-600 mt-2">Your personal space for inspiration and habit building</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => setShowReminderModal(true)}
              >
                <Bell className="h-4 w-4 mr-2" />
                New Reminder
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => setShowMicroActionModal(true)}
              >
                <Target className="h-4 w-4 mr-2" />
                New Micro-Action
              </Button>
              <Link href="/settings">
                <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0 shadow-blue-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Reminders</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeReminders}</div>
              <p className="text-xs text-blue-600 mt-1">keeping you inspired</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 shadow-purple-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Habits</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeHabits}</div>
              <p className="text-xs text-purple-600 mt-1">micro-actions building</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 shadow-orange-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Best Streak</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.bestStreak}</div>
              <p className="text-xs text-orange-600 mt-1">days strong</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 shadow-green-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalHabits + stats.activeReminders}</div>
              <p className="text-xs text-green-600 mt-1">items created</p>
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
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-white/50 hover:bg-white/80">
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-white/50 hover:bg-white/80">
                    <Quote className="h-4 w-4 mr-1" />
                    New Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Reminders</h2>
                <p className="text-gray-600">{reminders.length} active reminders</p>
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
                {reminders.map((reminder) => (
                  <Card key={reminder.id} className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{reminder.title}</h3>
                          {reminder.description && <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(reminder.createdAt).toLocaleDateString()}
                            </span>
                            {reminder.scheduledTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(reminder.scheduledTime).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600">Active</span>
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
                <p className="text-gray-600">{microActions.length} active micro-actions</p>
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
                {microActions.map((action) => (
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
