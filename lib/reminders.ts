"use client"

import type { Reminder } from "@/types"

export class ReminderService {
  private static instance: ReminderService

  static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService()
    }
    return ReminderService.instance
  }

  getReminders(userId: string): Reminder[] {
    const stored = localStorage.getItem(`reminders_${userId}`)
    return stored ? JSON.parse(stored) : []
  }

  createReminder(userId: string, reminderData: Omit<Reminder, "id" | "userId" | "createdAt" | "updatedAt">): Reminder {
    const reminders = this.getReminders(userId)

    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    reminders.push(newReminder)
    localStorage.setItem(`reminders_${userId}`, JSON.stringify(reminders))

    return newReminder
  }

  updateReminder(userId: string, reminderId: string, updates: Partial<Reminder>): Reminder {
    const reminders = this.getReminders(userId)
    const index = reminders.findIndex((r) => r.id === reminderId)

    if (index === -1) throw new Error("Reminder not found")

    const updatedReminder = {
      ...reminders[index],
      ...updates,
      updatedAt: new Date(),
    }

    reminders[index] = updatedReminder
    localStorage.setItem(`reminders_${userId}`, JSON.stringify(reminders))

    return updatedReminder
  }

  deleteReminder(userId: string, reminderId: string): void {
    const reminders = this.getReminders(userId)
    const filtered = reminders.filter((r) => r.id !== reminderId)
    localStorage.setItem(`reminders_${userId}`, JSON.stringify(filtered))
  }

  toggleReminder(userId: string, reminderId: string): Reminder {
    const reminders = this.getReminders(userId)
    const reminder = reminders.find((r) => r.id === reminderId)

    if (!reminder) throw new Error("Reminder not found")

    return this.updateReminder(userId, reminderId, { isActive: !reminder.isActive })
  }
}
