"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { QuoteGenerator } from "@/components/quotes/quote-generator"
import { CreateReminderModal } from "@/components/reminders/create-reminder-modal"
import { CreateMicroActionModal } from "@/components/micro-actions/create-micro-action-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Bell, Target, TrendingUp, Calendar, CheckCircle, Clock } from "lucide-react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImage: string | null
  createdAt: string
  emailConfirmed: boolean
}

interface DashboardClientContentProps {
  user: User
}

export function DashboardClientContent({ user }: DashboardClientContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reminderModalOpen, setReminderModalOpen] = useState(false)
  const [microActionModalOpen, setMicroActionModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="lg:pl-72">
        <Header user={user} setSidebarOpen={setSidebarOpen} />

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName || user.email}!</h1>
              <p className="mt-1 text-sm text-gray-600">Here's what's happening with your habits and goals today.</p>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => setReminderModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
                <Button
                  onClick={() => setMicroActionModalOpen(true)}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Micro-Action
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Bell className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Reminders</dt>
                        <dd className="text-lg font-medium text-gray-900">12</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Micro-Actions</dt>
                        <dd className="text-lg font-medium text-gray-900">8</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Current Streak</dt>
                        <dd className="text-lg font-medium text-gray-900">7 days</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Completed Today</dt>
                        <dd className="text-lg font-medium text-gray-900">5</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Today's Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription>Your reminders and micro-actions for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { time: "9:00 AM", title: "Morning meditation", type: "reminder", completed: true },
                        { time: "12:00 PM", title: "Drink water", type: "micro-action", completed: true },
                        { time: "3:00 PM", title: "Take a 5-minute walk", type: "micro-action", completed: false },
                        { time: "6:00 PM", title: "Evening gratitude", type: "reminder", completed: false },
                        { time: "9:00 PM", title: "Read one page", type: "micro-action", completed: false },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border">
                          <div className="flex-shrink-0">
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.time}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <Badge variant={item.type === "reminder" ? "default" : "secondary"}>{item.type}</Badge>
                          </div>
                          <div className="flex-shrink-0">
                            {item.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest habit completions and milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: "Completed morning meditation", time: "2 hours ago", type: "completion" },
                        { action: "7-day streak achieved!", time: "1 day ago", type: "milestone" },
                        { action: "Added new micro-action: Drink water", time: "2 days ago", type: "creation" },
                        { action: "Completed evening gratitude", time: "3 days ago", type: "completion" },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                activity.type === "milestone"
                                  ? "bg-yellow-400"
                                  : activity.type === "completion"
                                    ? "bg-green-400"
                                    : "bg-blue-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Daily Quote */}
                <QuoteGenerator />

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completion Rate</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Actions</span>
                        <span className="text-sm font-medium">34</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Best Streak</span>
                        <span className="text-sm font-medium">12 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateReminderModal open={reminderModalOpen} onOpenChange={setReminderModalOpen} />
      <CreateMicroActionModal open={microActionModalOpen} onOpenChange={setMicroActionModalOpen} />
    </div>
  )
}
