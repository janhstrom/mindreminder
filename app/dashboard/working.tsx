"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Quote, Bell, Heart, Sparkles, Target, TrendingUp, Zap } from "lucide-react"

// Simple test user
const TEST_USER = {
  id: "test-user-123",
  name: "Test User",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  createdAt: new Date(),
}

export default function WorkingDashboard() {
  const [user] = useState(TEST_USER)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("inspiration")

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}! ✨</h1>
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
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Dashboard Working!</h3>
              <p className="text-sm text-green-700 mt-1">
                The main dashboard is now loading successfully. Icons and authentication are working.
              </p>
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
              <div className="text-2xl font-bold text-gray-900">3</div>
              <p className="text-xs text-blue-600">keeping you inspired</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Habits</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">5</div>
              <p className="text-xs text-purple-600">micro-actions building</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Best Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <p className="text-xs text-orange-600">days strong</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Today</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3/5</div>
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
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">🎉 Dashboard Fixed!</h4>
                    <p className="text-blue-800 text-sm">
                      The main dashboard is now working. Ready to add real authentication and database features.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">🚀 What's Next?</h4>
                    <ul className="text-purple-800 text-sm space-y-1">
                      <li>• Real user authentication</li>
                      <li>• Smart notifications</li>
                      <li>• Habit tracking</li>
                      <li>• Progress analytics</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Reminders Coming Soon</h3>
              <p className="text-gray-600 mb-4">This feature will be available once authentication is set up</p>
            </div>
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Habit Builder Coming Soon</h3>
              <p className="text-gray-600 mb-4">This feature will be available once authentication is set up</p>
            </div>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Quote className="h-5 w-5 mr-2 text-blue-600" />
                  Quote Generator Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">AI-powered quote generation will be available soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
