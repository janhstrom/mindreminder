"use client"

// Simple in-memory storage for demo purposes
// This will work immediately without database issues

interface SimpleReminder {
  id: string
  title: string
  description?: string
  scheduledTime?: string
  isActive: boolean
  createdAt: string
}

interface SimpleMicroAction {
  id: string
  title: string
  category: string
  duration: string
  frequency: string
  isActive: boolean
  currentStreak: number
  createdAt: string
}

class SimpleDataService {
  private reminders: SimpleReminder[] = []
  private microActions: SimpleMicroAction[] = []

  // Load from localStorage on init
  constructor() {
    if (typeof window !== "undefined") {
      const savedReminders = localStorage.getItem("mindreminder-reminders")
      const savedMicroActions = localStorage.getItem("mindreminder-microactions")

      if (savedReminders) {
        this.reminders = JSON.parse(savedReminders)
      }
      if (savedMicroActions) {
        this.microActions = JSON.parse(savedMicroActions)
      }
    }
  }

  // Reminders
  async getReminders(): Promise<SimpleReminder[]> {
    return [...this.reminders]
  }

  async createReminder(data: Omit<SimpleReminder, "id" | "createdAt">): Promise<SimpleReminder> {
    const reminder: SimpleReminder = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    this.reminders.unshift(reminder)
    this.saveToStorage()
    return reminder
  }

  async deleteReminder(id: string): Promise<void> {
    this.reminders = this.reminders.filter((r) => r.id !== id)
    this.saveToStorage()
  }

  // Micro Actions
  async getMicroActions(): Promise<SimpleMicroAction[]> {
    return [...this.microActions]
  }

  async createMicroAction(
    data: Omit<SimpleMicroAction, "id" | "createdAt" | "currentStreak">,
  ): Promise<SimpleMicroAction> {
    const microAction: SimpleMicroAction = {
      ...data,
      id: Date.now().toString(),
      currentStreak: 0,
      createdAt: new Date().toISOString(),
    }

    this.microActions.unshift(microAction)
    this.saveToStorage()
    return microAction
  }

  async deleteMicroAction(id: string): Promise<void> {
    this.microActions = this.microActions.filter((m) => m.id !== id)
    this.saveToStorage()
  }

  // Stats
  async getStats() {
    return {
      activeReminders: this.reminders.filter((r) => r.isActive).length,
      activeHabits: this.microActions.filter((m) => m.isActive).length,
      bestStreak: Math.max(...this.microActions.map((m) => m.currentStreak), 0),
      completedToday: 0,
      totalHabits: this.microActions.length,
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("mindreminder-reminders", JSON.stringify(this.reminders))
      localStorage.setItem("mindreminder-microactions", JSON.stringify(this.microActions))
    }
  }
}

export const simpleDataService = new SimpleDataService()
