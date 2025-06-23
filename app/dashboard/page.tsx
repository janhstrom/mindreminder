"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Calendar, Users, BarChart3, Bell, Home, Quote, Settings } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  useEffect(() => {
    console.log("Dashboard component mounted")

    // Simple timeout to test if this runs
    const timer = setTimeout(() => {
      console.log("Timer executed - JavaScript is working")
      setLoading(false)
      setUser({ id: "test", name: "Test User", email: "test@example.com", role: "user" })
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  console.log("Dashboard render - loading:", loading, "user:", user)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading MindReMinder...</p>
            <p className="text-sm text-muted-foreground">Setting up your dashboard</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500">
            <Bell className="h-12 w-12 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your reminders</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Reminder
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reminders</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">8 active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Friends</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">
              <Home className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Calendar className="h-4 w-4 mr-2" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="quotes">
              <Quote className="h-4 w-4 mr-2" />
              Quotes
            </TabsTrigger>
            <TabsTrigger value="friends">
              <Users className="h-4 w-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              {user?.role === "admin" ? "Admin Analytics" : "My Analytics"}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Completed "Morning workout"</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Created "Team meeting prep"</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Snoozed "Call dentist"</p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Team standup</p>
                        <p className="text-xs text-muted-foreground">Today at 9:00 AM</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Grocery shopping</p>
                        <p className="text-xs text-muted-foreground">Today at 6:00 PM</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Doctor appointment</p>
                        <p className="text-xs text-muted-foreground">Tomorrow at 2:00 PM</p>
                      </div>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reminders">
            <Card>
              <CardHeader>
                <CardTitle>Your Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reminder management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Daily Inspiration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Quote generator coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <Card>
              <CardHeader>
                <CardTitle>Friends & Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Friends system coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <HybridAnalyticsDashboard user={user} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Hybrid Analytics Component
function HybridAnalyticsDashboard({ user }: { user: any }) {
  const isAdmin = user?.role === "admin"

  return (
    <div className="space-y-6">
      {/* Personal Analytics (Always Shown) */}
      <Card>
        <CardHeader>
          <CardTitle>Your Personal Analytics</CardTitle>
          <p className="text-sm text-muted-foreground">Your productivity insights and usage patterns</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">47</div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3m 24s</div>
              <p className="text-sm text-muted-foreground">Avg Session Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Analytics (Only for Admins) */}
      {isAdmin && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>🔐 Admin Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">Global app metrics and user insights</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8,934</div>
                  <p className="text-sm text-muted-foreground">Total Reminders</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">92%</div>
                  <p className="text-sm text-muted-foreground">User Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">New Users (Last 7 days)</span>
                  <span className="font-bold">+23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Users (Last 30 days)</span>
                  <span className="font-bold">892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Retention Rate</span>
                  <span className="font-bold">78%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Feature Usage (Shown to All) */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Reminders Created</span>
              <span className="font-bold">{isAdmin ? "8,934 total" : "23 by you"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Quotes Generated</span>
              <span className="font-bold">{isAdmin ? "2,156 total" : "12 by you"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Friends Connected</span>
              <span className="font-bold">{isAdmin ? "456 connections" : "3 friends"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
