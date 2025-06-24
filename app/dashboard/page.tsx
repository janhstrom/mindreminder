"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Target, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { CreateReminderModal } from "@/components/reminders/create-reminder-modal"
import { CreateMicroActionModal } from "@/components/micro-actions/create-micro-action-modal"
import { ReminderCard } from "@/components/reminders/reminder-card"
import { MicroActionCard } from "@/components/micro-actions/micro-action-card"
import { useAuth } from "@/components/auth/auth-provider"
import type { Reminder, MicroAction } from "@/types"

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showMicroActionModal, setShowMicroActionModal] = useState(false)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [microActions, setMicroActions] = useState<MicroAction[]>([])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Load data from localStorage for now
  useEffect(() => {
    if (user) {
      const savedReminders = localStorage.getItem(`reminders_${user.id}`)
      const savedMicroActions = localStorage.getItem(`microActions_${user.id}`)

      if (savedReminders) {
        setReminders(JSON.parse(savedReminders))
      }
      if (savedMicroActions) {
        setMicroActions(JSON.parse(savedMicroActions))
      }
    }
  }, [user])

  const handleReminderCreated = (reminder: Reminder) => {
    const newReminders = [...reminders, reminder]
    setReminders(newReminders)
    if (user) {
      localStorage.setItem(`reminders_${user.id}`, JSON.stringify(newReminders))
    }
  }

  const handleMicroActionCreated = (microAction: MicroAction) => {
    const newMicroActions = [...microActions, microAction]
    setMicroActions(newMicroActions)
    if (user) {
      localStorage.setItem(`microActions_${user.id}`, JSON.stringify(newMicroActions))
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  const stats = {
    totalReminders: reminders.length,
    completedToday: reminders.filter((r) => r.completed).length,
    activeHabits: microActions.length,
    streakDays: 7,
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

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.firstName}!</h1>
              <p className="text-muted-foreground">Ready to build some amazing habits today?</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Reminders</p>
                      <p className="text-2xl font-bold">{stats.totalReminders}</p>
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

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-purple-600" />
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
                      <p className="text-sm font-medium text-muted-foreground">Streak Days</p>
                      <p className="text-2xl font-bold">{stats.streakDays}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Reminders</span>
                    <Button onClick={() => setShowReminderModal(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Reminder
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reminders.slice(0, 3).map((reminder) => (
                      <ReminderCard key={reminder.id} reminder={reminder} />
                    ))}
                    {reminders.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No reminders yet. Create your first one!</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Micro-Actions</span>
                    <Button onClick={() => setShowMicroActionModal(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Habit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {microActions.slice(0, 3).map((action) => (
                      <MicroActionCard key={action.id} microAction={action} />
                    ))}
                    {microActions.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        No habits yet. Create your first micro-action!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateReminderModal
        open={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onReminderCreated={handleReminderCreated}
      />

      <CreateMicroActionModal
        open={showMicroActionModal}
        onClose={() => setShowMicroActionModal(false)}
        onMicroActionCreated={handleMicroActionCreated}
      />
    </div>
  )
}
