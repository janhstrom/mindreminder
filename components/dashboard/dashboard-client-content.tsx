"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { QuoteGenerator } from "@/components/quotes/quote-generator"
import { CreateReminderModal } from "@/components/reminders/create-reminder-modal"
import { CreateMicroActionModal } from "@/components/micro-actions/create-micro-action-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Target, Users, BarChart3 } from "lucide-react"

interface DashboardClientContentProps {
  user: User
}

export function DashboardClientContent({ user }: DashboardClientContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reminderModalOpen, setReminderModalOpen] = useState(false)
  const [microActionModalOpen, setMicroActionModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.user_metadata?.first_name || user.email}!
              </h1>
              <p className="text-gray-600 mt-2">Here's what's happening with your goals today.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setReminderModalOpen(true)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Create Reminder</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+</div>
                  <p className="text-xs text-muted-foreground">Add a new reminder</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setMicroActionModalOpen(true)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Micro Action</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+</div>
                  <p className="text-xs text-muted-foreground">Quick 2-minute task</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Friends</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Connected friends</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0%</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Quote */}
            <div className="mb-8">
              <QuoteGenerator />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest reminders and micro actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity yet.</p>
                  <p className="text-sm mt-2">Create your first reminder or micro action to get started!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateReminderModal isOpen={reminderModalOpen} onClose={() => setReminderModalOpen(false)} />
      <CreateMicroActionModal isOpen={microActionModalOpen} onClose={() => setMicroActionModalOpen(false)} />
    </div>
  )
}
