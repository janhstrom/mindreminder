"use client"

import { supabase } from "./supabase"

export interface DashboardStats {
  activeReminders: number
  activeHabits: number
  bestStreak: number
  completedToday: number
  totalHabits: number
}

export interface SimpleReminder {
  id: string
  title: string
  description?: string
  scheduledTime?: string
  isActive: boolean
  createdAt: string
}

export interface SimpleMicroAction {
  id: string
  title: string
  category: string
  currentStreak: number
  completedToday?: boolean
  isActive: boolean
}

export class DashboardDataService {
  static async getStats(userId?: string): Promise<DashboardStats> {
    try {
      // For now, return demo data if no user
      if (!userId) {
        return {
          activeReminders: 0,
          activeHabits: 0,
          bestStreak: 0,
          completedToday: 0,
          totalHabits: 0,
        }
      }

      // Get reminders count
      const { count: remindersCount } = await supabase
        .from("reminders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_active", true)

      // Get micro-actions count
      const { count: habitsCount } = await supabase
        .from("micro_actions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_active", true)

      // Get best streak
      const { data: bestStreakData } = await supabase
        .from("micro_actions")
        .select("best_streak")
        .eq("user_id", userId)
        .order("best_streak", { ascending: false })
        .limit(1)

      // Get today's completions
      const today = new Date().toISOString().split("T")[0]
      const { count: completedTodayCount } = await supabase
        .from("micro_action_completions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completion_date", today)

      return {
        activeReminders: remindersCount || 0,
        activeHabits: habitsCount || 0,
        bestStreak: bestStreakData?.[0]?.best_streak || 0,
        completedToday: completedTodayCount || 0,
        totalHabits: habitsCount || 0,
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      return {
        activeReminders: 0,
        activeHabits: 0,
        bestStreak: 0,
        completedToday: 0,
        totalHabits: 0,
      }
    }
  }

  static async getReminders(userId?: string): Promise<SimpleReminder[]> {
    try {
      if (!userId) return []

      const { data, error } = await supabase
        .from("reminders")
        .select("id, title, description, scheduled_time, is_active, created_at")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error

      return (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        scheduledTime: item.scheduled_time || undefined,
        isActive: item.is_active,
        createdAt: item.created_at,
      }))
    } catch (error) {
      console.error("Error fetching reminders:", error)
      return []
    }
  }

  static async getMicroActions(userId?: string): Promise<SimpleMicroAction[]> {
    try {
      if (!userId) return []

      const { data, error } = await supabase
        .from("micro_actions")
        .select("id, title, category, current_streak, is_active")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error

      // Check today's completions
      const today = new Date().toISOString().split("T")[0]
      const { data: completions } = await supabase
        .from("micro_action_completions")
        .select("micro_action_id")
        .eq("user_id", userId)
        .eq("completion_date", today)

      const completedToday = new Set(completions?.map((c) => c.micro_action_id) || [])

      return (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        currentStreak: item.current_streak,
        completedToday: completedToday.has(item.id),
        isActive: item.is_active,
      }))
    } catch (error) {
      console.error("Error fetching micro-actions:", error)
      return []
    }
  }

  static async createReminder(reminderData: {
    title: string
    description?: string
    scheduledTime?: string
    isActive: boolean
  }): Promise<SimpleReminder> {
    try {
      const { data, error } = await supabase
        .from("reminders")
        .insert({
          user_id: "demo-user", // For now, using demo user
          title: reminderData.title,
          description: reminderData.description || null,
          scheduled_time: reminderData.scheduledTime || null,
          is_active: reminderData.isActive,
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        scheduledTime: data.scheduled_time || undefined,
        isActive: data.is_active,
        createdAt: data.created_at,
      }
    } catch (error) {
      console.error("Error creating reminder:", error)
      throw error
    }
  }

  static async createMicroAction(microActionData: {
    title: string
    description?: string
    category: string
    duration: string
    frequency: string
    isActive: boolean
  }): Promise<SimpleMicroAction> {
    try {
      const { data, error } = await supabase
        .from("micro_actions")
        .insert({
          user_id: "demo-user", // For now, using demo user
          title: microActionData.title,
          description: microActionData.description || null,
          category: microActionData.category,
          duration: microActionData.duration,
          frequency: microActionData.frequency,
          is_active: microActionData.isActive,
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        title: data.title,
        category: data.category,
        currentStreak: data.current_streak || 0,
        completedToday: false,
        isActive: data.is_active,
      }
    } catch (error) {
      console.error("Error creating micro-action:", error)
      throw error
    }
  }
}
