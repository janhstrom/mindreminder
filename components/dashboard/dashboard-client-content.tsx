"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Target, Users, TrendingUp } from "lucide-react"
import { CreateReminderModal } from "@/components/reminders/create-reminder-modal"
import { CreateMicroActionModal } from "@/components/micro-actions/create-micro-action-modal"

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
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showMicroActionModal, setShowMicroActionModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName || user.email}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your goals today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Reminders</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No reminders yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Micro Actions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No actions yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Friends</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No friends yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Reminder</CardTitle>
              <CardDescription>Set up a new reminder to stay on track with your goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowReminderModal(true)} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Micro Action</CardTitle>
              <CardDescription>Add a small, actionable step towards your bigger goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowMicroActionModal(true)} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Micro Action
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest reminders and completed actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity. Start by creating your first reminder or micro action!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateReminderModal open={showReminderModal} onOpenChange={setShowReminderModal} />
      <CreateMicroActionModal open={showMicroActionModal} onOpenChange={setShowMicroActionModal} />
    </div>
  )
}
