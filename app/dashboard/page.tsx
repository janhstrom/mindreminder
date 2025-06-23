"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Quote, Bell, Heart, Sparkles, Target, TrendingUp, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("inspiration")

  // Sample stats for demo
  const stats = {
    activeReminders: 3,
    activeHabits: 5,
    bestStreak: 7,
    completedToday: 2,
    totalHabits: 5,
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
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Bell className="h-4 w-4 mr-2" />
                New Reminder
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Target className="h-4 w-4 mr-2" />
                New Micro-Action
              </Button>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">🎯</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-green-900">Dashboard Demo Mode</h3>
              <p className="text-green-700 mt-1">
                This is a preview of your MindReMinder dashboard. All features are ready to be connected to your
                personal data!
              </p>
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
              <CardTitle className="text-sm font-medium text-gray-600">Completed Today</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.completedToday}/{stats.totalHabits}
              </div>
              <p className="text-xs text-green-600 mt-1">micro-actions done</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger
              value="inspiration"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-50 data-[state=active]:to-orange-50"
            >
              <Sparkles className="h-4 w-4" />
              Daily Inspiration
            </TabsTrigger>
            <TabsTrigger
              value="reminders"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-cyan-50"
            >
              <Bell className="h-4 w-4" />
              My Reminders
            </TabsTrigger>
            <TabsTrigger
              value="habits"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-pink-50"
            >
              <Target className="h-4 w-4" />
              Habit Builder
            </TabsTrigger>
            <TabsTrigger
              value="quotes"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-50 data-[state=active]:to-emerald-50"
            >
              <Quote className="h-4 w-4" />
              Quote Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inspiration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  >
                    <div className="text-left">
                      <div className="font-medium">💭 Daily Affirmation</div>
                      <div className="text-sm text-gray-500">Remind me to practice self-love</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  >
                    <div className="text-left">
                      <div className="font-medium">🌅 Morning Motivation</div>
                      <div className="text-sm text-gray-500">Start my day with intention</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
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
                <h2 className="text-2xl font-bold text-gray-900">Your Reminders</h2>
                <p className="text-gray-600">Gentle nudges for what matters to you</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Ready for Your First Reminder!</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Create personalized reminders that gently nudge you toward your goals throughout the day.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Reminder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Habit Builder</h2>
                <p className="text-gray-600">Build lasting habits through tiny daily actions</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                New Micro-Action
              </Button>
            </div>

            <Card className="bg-white shadow-lg border-0">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Ready for Micro-Actions!</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start building life-changing habits with tiny actions that compound into extraordinary results.
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Habit
                </Button>
              </CardContent>
            </Card>
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

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Ready to Transform Your Life?</h3>
            <p className="text-gray-600 mb-4">
              This dashboard is ready for your personal data. Connect authentication and start building lasting habits!
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
