"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Bell, Target, User, LogOut } from "lucide-react"

interface SimpleReminder {
  id: string
  title: string
  description?: string
  createdAt: string
}

interface SimpleMicroAction {
  id: string
  title: string
  category: string
  createdAt: string
}

export default function SimpleWorkingDashboard() {
  const [reminders, setReminders] = useState<SimpleReminder[]>([])
  const [microActions, setMicroActions] = useState<SimpleMicroAction[]>([])
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [showMicroActionForm, setShowMicroActionForm] = useState(false)
  const [reminderTitle, setReminderTitle] = useState("")
  const [reminderDescription, setReminderDescription] = useState("")
  const [microActionTitle, setMicroActionTitle] = useState("")
  const [microActionCategory, setMicroActionCategory] = useState("Health")

  // Load data on mount
  useEffect(() => {
    const savedReminders = localStorage.getItem("simple_reminders")
    const savedMicroActions = localStorage.getItem("simple_microactions")

    if (savedReminders) {
      try {
        setReminders(JSON.parse(savedReminders))
      } catch (e) {
        console.log("Error loading reminders")
      }
    }

    if (savedMicroActions) {
      try {
        setMicroActions(JSON.parse(savedMicroActions))
      } catch (e) {
        console.log("Error loading micro actions")
      }
    }
  }, [])

  const addReminder = () => {
    if (!reminderTitle.trim()) return

    const newReminder: SimpleReminder = {
      id: Date.now().toString(),
      title: reminderTitle,
      description: reminderDescription || undefined,
      createdAt: new Date().toISOString(),
    }

    const newReminders = [...reminders, newReminder]
    setReminders(newReminders)
    localStorage.setItem("simple_reminders", JSON.stringify(newReminders))

    setReminderTitle("")
    setReminderDescription("")
    setShowReminderForm(false)
  }

  const addMicroAction = () => {
    if (!microActionTitle.trim()) return

    const newMicroAction: SimpleMicroAction = {
      id: Date.now().toString(),
      title: microActionTitle,
      category: microActionCategory,
      createdAt: new Date().toISOString(),
    }

    const newMicroActions = [...microActions, newMicroAction]
    setMicroActions(newMicroActions)
    localStorage.setItem("simple_microactions", JSON.stringify(newMicroActions))

    setMicroActionTitle("")
    setMicroActionCategory("Health")
    setShowMicroActionForm(false)
  }

  const deleteReminder = (id: string) => {
    const newReminders = reminders.filter((r) => r.id !== id)
    setReminders(newReminders)
    localStorage.setItem("simple_reminders", JSON.stringify(newReminders))
  }

  const deleteMicroAction = (id: string) => {
    const newMicroActions = microActions.filter((m) => m.id !== id)
    setMicroActions(newMicroActions)
    localStorage.setItem("simple_microactions", JSON.stringify(newMicroActions))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">MindReMinder</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">Welcome back!</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Reminders</p>
                  <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Habits</p>
                  <p className="text-2xl font-bold text-gray-900">{microActions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{reminders.length + microActions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reminders Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Reminders ({reminders.length})
                </CardTitle>
                <Button onClick={() => setShowReminderForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showReminderForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Reminder title"
                      value={reminderTitle}
                      onChange={(e) => setReminderTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={reminderDescription}
                      onChange={(e) => setReminderDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button onClick={addReminder} size="sm">
                        Save
                      </Button>
                      <Button onClick={() => setShowReminderForm(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {reminders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reminders yet. Create your first one!</p>
                ) : (
                  reminders.map((reminder) => (
                    <div key={reminder.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                          {reminder.description && <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(reminder.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => deleteReminder(reminder.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Micro Actions Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Habits ({microActions.length})
                </CardTitle>
                <Button onClick={() => setShowMicroActionForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showMicroActionForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Habit title"
                      value={microActionTitle}
                      onChange={(e) => setMicroActionTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select
                      value={microActionCategory}
                      onChange={(e) => setMicroActionCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Health">Health</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Learning">Learning</option>
                      <option value="Mindfulness">Mindfulness</option>
                      <option value="Exercise">Exercise</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex gap-2">
                      <Button onClick={addMicroAction} size="sm">
                        Save
                      </Button>
                      <Button onClick={() => setShowMicroActionForm(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {microActions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No habits yet. Create your first one!</p>
                ) : (
                  microActions.map((action) => (
                    <div key={action.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{action.title}</h3>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {action.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{new Date(action.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Button
                          onClick={() => deleteMicroAction(action.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
