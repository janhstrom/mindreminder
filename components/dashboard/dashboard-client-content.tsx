"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { QuoteGenerator } from "@/components/quotes/quote-generator"
import { CreateReminderModal } from "@/components/reminders/create-reminder-modal"
import { CreateMicroActionModal } from "@/components/micro-actions/create-micro-action-modal"
import { signOut } from "@/lib/auth/actions"
import { Plus, Target, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImage?: string | null
  createdAt: string
  emailConfirmed: boolean
}

interface DashboardClientContentProps {
  user: User
}

export function DashboardClientContent({ user }: DashboardClientContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [reminders, setReminders] = useState<any[]>([])
  const [microActions, setMicroActions] = useState<any[]>([])
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showMicroActionModal, setShowMicroActionModal] = useState(false)

  useEffect(() => {
    // Load data from localStorage for now
    const savedReminders = localStorage.getItem("reminders")
    const savedMicroActions = localStorage.getItem("microActions")

    if (savedReminders) {
      try {
        const parsed = JSON.parse(savedReminders)
        if (Array.isArray(parsed)) {
          setReminders(parsed)
        }
      } catch (error) {
        console.error("Error parsing reminders:", error)
      }
    }

    if (savedMicroActions) {
      try {
        const parsed = JSON.parse(savedMicroActions)
        if (Array.isArray(parsed)) {
          setMicroActions(parsed)
        }
      } catch (error) {
        console.error("Error parsing micro actions:", error)
      }
    }
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Calculate stats with proper null checks
  const activeReminders = reminders.filter((r) => r && r.isActive === true).length
  const completedMicroActions = microActions.filter((m) => m && m.isCompleted === true).length
  const totalMicroActions = microActions.filter((m) => m && m.id).length
  const completionRate = totalMicroActions > 0 ? Math.round((completedMicroActions / totalMicroActions) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "ml-0"}`}>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName || "User"}!</h1>
              <p className="text-gray-600">Here's your progress and daily inspiration.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Reminders</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeReminders}</div>
                  <p className="text-xs text-muted-foreground">Keeping you on track</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Micro Actions</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalMicroActions}</div>
                  <p className="text-xs text-muted-foreground">Small steps, big impact</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedMicroActions}</div>
                  <p className="text-xs text-muted-foreground">Great progress!</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completionRate}%</div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
                <TabsTrigger value="micro-actions">Micro Actions</TabsTrigger>
                <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Reminders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reminders.filter((r) => r && r.id).slice(0, 3).length > 0 ? (
                        <div className="space-y-3">
                          {reminders
                            .filter((r) => r && r.id)
                            .slice(0, 3)
                            .map((reminder) => (
                              <div
                                key={reminder.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">{reminder.title}</p>
                                  <p className="text-sm text-gray-600">{reminder.description}</p>
                                </div>
                                <Badge variant={reminder.isActive ? "default" : "secondary"}>
                                  {reminder.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No reminders yet</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Micro Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {microActions.filter((m) => m && m.id).slice(0, 3).length > 0 ? (
                        <div className="space-y-3">
                          {microActions
                            .filter((m) => m && m.id)
                            .slice(0, 3)
                            .map((action) => (
                              <div
                                key={action.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">{action.title}</p>
                                  <p className="text-sm text-gray-600">{action.description}</p>
                                </div>
                                <Badge variant={action.isCompleted ? "default" : "outline"}>
                                  {action.isCompleted ? "Done" : "Pending"}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No micro actions yet</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reminders" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Reminders</h2>
                  <Button onClick={() => setShowReminderModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>

                <div className="grid gap-4">
                  {reminders.filter((r) => r && r.id).length > 0 ? (
                    reminders
                      .filter((r) => r && r.id)
                      .map((reminder) => (
                        <Card key={reminder.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{reminder.title}</h3>
                                <p className="text-gray-600">{reminder.description}</p>
                                {reminder.scheduledTime && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Scheduled: {new Date(reminder.scheduledTime).toLocaleString()}
                                  </p>
                                )}
                              </div>
                              <Badge variant={reminder.isActive ? "default" : "secondary"}>
                                {reminder.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-500 mb-4">No reminders created yet</p>
                        <Button onClick={() => setShowReminderModal(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Reminder
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="micro-actions" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Micro Actions</h2>
                  <Button onClick={() => setShowMicroActionModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Micro Action
                  </Button>
                </div>

                <div className="grid gap-4">
                  {microActions.filter((m) => m && m.id).length > 0 ? (
                    microActions
                      .filter((m) => m && m.id)
                      .map((action) => (
                        <Card key={action.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{action.title}</h3>
                                <p className="text-gray-600">{action.description}</p>
                                {action.category && (
                                  <Badge variant="outline" className="mt-2">
                                    {action.category}
                                  </Badge>
                                )}
                              </div>
                              <Badge variant={action.isCompleted ? "default" : "outline"}>
                                {action.isCompleted ? "Completed" : "Pending"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-500 mb-4">No micro actions created yet</p>
                        <Button onClick={() => setShowMicroActionModal(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Micro Action
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="inspiration" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Daily Inspiration</h2>
                  <QuoteGenerator />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onReminderCreated={(newReminder) => {
          setReminders((prev) => [...prev, newReminder])
          localStorage.setItem("reminders", JSON.stringify([...reminders, newReminder]))
        }}
      />

      <CreateMicroActionModal
        isOpen={showMicroActionModal}
        onClose={() => setShowMicroActionModal(false)}
        onMicroActionCreated={(newAction) => {
          setMicroActions((prev) => [...prev, newAction])
          localStorage.setItem("microActions", JSON.stringify([...microActions, newAction]))
        }}
      />
    </div>
  )
}
