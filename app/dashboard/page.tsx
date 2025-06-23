"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Quote, Bell, Heart, Sparkles, Target, TrendingUp, Zap, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("inspiration")

  // Sample stats for now
  const stats = {
    activeReminders: 3,
    activeHabits: 5,
    bestStreak: 7,
    completedToday: 2,
    totalHabits: 5,
  }

  useEffect(() => {
    if (!loading && !user) {
      console.log("🔒 No authenticated user, redirecting to home")
      router.push("/")
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Loading MindReMinder...</h2>
            <p className="text-gray-600">Checking your authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access your dashboard</p>
          <Button onClick={() => router.push("/")}>Go to Sign In</Button>
        </div>
      </div>
    )
  }

  console.log("🎯 Dashboard rendering with authenticated user:", user)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName || user.email}! ✨</h1>
              <p className="text-gray-600 mt-2">Your personal space for inspiration and habit building</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Bell className="h-4 w-4 mr-2" />
                New Reminder
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Target className="h-4 w-4 mr-2" />
                New Micro-Action
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Auth Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">🔐</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Authentication Working!</h3>
              <p className="text-sm text-green-700 mt-1">
                Logged in as {user.email}. Ready to add database features and habit tracking.
              </p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">👤 User Info</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Created:</strong> {user.createdAt.toLocaleDateString()}
            </p>
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
              <div className="text-2xl font-bold text-gray-900">{stats.activeReminders}</div>
              <p className="text-xs text-blue-600">keeping you inspired</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Habits</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeHabits}</div>
              <p className="text-xs text-purple-600">micro-actions building</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Best Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.bestStreak}</div>
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
                {stats.completedToday}/{stats.totalHabits}
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
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">💭 Daily Affirmation</div>
                      <div className="text-sm text-gray-500">Remind me to practice self-love</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">🌅 Morning Motivation</div>
                      <div className="text-sm text-gray-500">Start my day with intention</div>
                    </div>
                  </Button>

                  <Button variant="outline" className="w-full justify-start h-auto p-4">
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>

            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready for Database Integration!</h3>
              <p className="text-gray-600 mb-4">Authentication working. Ready to load your personal reminders.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Reminder
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Habit Builder</h2>
                <p className="text-gray-600">Build lasting habits through tiny daily actions</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Micro-Action
              </Button>
            </div>

            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready for Habit Tracking!</h3>
              <p className="text-gray-600 mb-4">Authentication working. Ready to build your personal habits.</p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Habit
              </Button>
            </div>
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
                <div className="text-center py-8">
                  <Quote className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready for AI Quotes!</h3>
                  <p className="text-gray-600 mb-4">Authentication working. Ready to generate personalized quotes.</p>
                  <Button>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🚀 What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">✅ Completed</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Dashboard UI working perfectly</li>
                <li>• Icons fixed and loading</li>
                <li>• Real authentication system</li>
                <li>• User session management</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">🎯 Ready to Build</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Connect to Supabase database</li>
                <li>• Load user's personal data</li>
                <li>• Habit tracking system</li>
                <li>• Smart push notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
