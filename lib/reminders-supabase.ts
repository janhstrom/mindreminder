"use client"

import { supabase } from "./supabase"
import type { Database } from "./supabase"

type ReminderRow = Database["public"]["Tables"]["reminders"]["Row"]
type ReminderInsert = Database["public"]["Tables"]["reminders"]["Insert"]
type ReminderUpdate = Database["public"]["Tables"]["reminders"]["Update"]

export interface Reminder {
  id: string
  userId: string
  title: string
  description?: string
  image?: string
  scheduledTime?: Date
  location?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export class SupabaseReminderService {
  private static instance: SupabaseReminderService

  static getInstance(): SupabaseReminderService {
    if (!SupabaseReminderService.instance) {
      SupabaseReminderService.instance = new SupabaseReminderService()
    }
    return SupabaseReminderService.instance
  }

  async getReminders(userId: string): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data.map(this.mapRowToReminder)
  }

  async createReminder(
    userId: string,
    reminderData: Omit<Reminder, "id" | "userId" | "createdAt" | "updatedAt">,
  ): Promise<Reminder> {
    const insertData: ReminderInsert = {
      user_id: userId,
      title: reminderData.title,
      description: reminderData.description || null,
      image: reminderData.image || null,
      scheduled_time: reminderData.scheduledTime?.toISOString() || null,
      location: reminderData.location || null,
      is_active: reminderData.isActive,
    }

    const { data, error } = await supabase.from("reminders").insert(insertData).select().single()

    if (error) throw error

    return this.mapRowToReminder(data)
  }

  async updateReminder(userId: string, reminderId: string, updates: Partial<Reminder>): Promise<Reminder> {
    const updateData: ReminderUpdate = {}

    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description || null
    if (updates.image !== undefined) updateData.image = updates.image || null
    if (updates.scheduledTime !== undefined) updateData.scheduled_time = updates.scheduledTime?.toISOString() || null
    if (updates.location !== undefined) updateData.location = updates.location || null
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive

    const { data, error } = await supabase
      .from("reminders")
      .update(updateData)
      .eq("id", reminderId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) throw error

    return this.mapRowToReminder(data)
  }

  async deleteReminder(userId: string, reminderId: string): Promise<void> {
    const { error } = await supabase.from("reminders").delete().eq("id", reminderId).eq("user_id", userId)

    if (error) throw error
  }

  async toggleReminder(userId: string, reminderId: string): Promise<Reminder> {
    // First get the current state
    const { data: currentData, error: fetchError } = await supabase
      .from("reminders")
      .select("is_active")
      .eq("id", reminderId)
      .eq("user_id", userId)
      .single()

    if (fetchError) throw fetchError

    // Toggle the state
    const { data, error } = await supabase
      .from("reminders")
      .update({ is_active: !currentData.is_active })
      .eq("id", reminderId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) throw error

    return this.mapRowToReminder(data)
  }

  private mapRowToReminder(row: ReminderRow): Reminder {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description || undefined,
      image: row.image || undefined,
      scheduledTime: row.scheduled_time ? new Date(row.scheduled_time) : undefined,
      location: row.location || undefined,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }
}
