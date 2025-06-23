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

// Simple user management for demo purposes
export class UserService {
  static async ensureDemoUser(): Promise<string> {
    const demoUserId = "demo-user-123"

    // Check if demo user exists in profiles table
    const { data: existingUser } = await supabase.from("profiles").select("id").eq("id", demoUserId).single()

    if (!existingUser) {
      // Create demo user profile
      const { error } = await supabase.from("profiles").insert({
        id: demoUserId,
        email: "demo@mindreminder.com",
        first_name: "Demo",
        last_name: "User",
      })

      if (error) {
        console.error("Error creating demo user:", error)
      }
    }

    return demoUserId
  }
}

export class DashboardDataService {
  static async getStats(userId?: string): Promise<DashboardStats> {
    try {
      const actualUserId = userId || (await UserService.ensureDemoUser())

      // Get reminders count
      const { count: remindersCount } = await supabase
        .from("reminders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", actualUserId)
        .eq("is_active", true)

      // Get micro-actions count
      const { count: habitsCount } = await supabase
        .from("micro_actions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", actualUserId)
        .eq("is_active", true)

      // Get best streak
      const { data: bestStreakData } = await supabase
        .from("micro_actions")
        .select("best_streak")
        .eq("user_id", actualUserId)
        .order("best_streak", { ascending: false })
        .limit(1)

      // Get today's completions
      const today = new Date().toISOString().split("T")[0]
      const { count: completedTodayCount } = await supabase
        .from("micro_action_completions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", actualUserId)
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
      const actualUserId = userId || (await UserService.ensureDemoUser())

      const { data, error } = await supabase
        .from("reminders")
        .select("id, title, description, scheduled_time, is_active, created_at")
        .eq("user_id", actualUserId)
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
      const actualUserId = userId || (await UserService.ensureDemoUser())

      const { data, error } = await supabase
        .from("micro_actions")
        .select("id, title, category, current_streak, is_active")
        .eq("user_id", actualUserId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error

      // Check today's completions
      const today = new Date().toISOString().split("T")[0]
      const { data: completions } = await supabase
        .from("micro_action_completions")
        .select("micro_action_id")
        .eq("user_id", actualUserId)
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
    location?: string
    image?: string
    isActive: boolean
  }): Promise<SimpleReminder> {
    try {
      const userId = await UserService.ensureDemoUser()

      const { data, error } = await supabase
        .from("reminders")
        .insert({
          user_id: userId,
          title: reminderData.title,
          description: reminderData.description || null,
          scheduled_time: reminderData.scheduledTime || null,
          location: reminderData.location || null,
          image: reminderData.image || null,
          is_active: reminderData.isActive,
        })
        .select()
        .single()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

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
    timeOfDay?: string
    habitStack?: string
    isActive: boolean
  }): Promise<SimpleMicroAction> {
    try {
      const userId = await UserService.ensureDemoUser()

      const { data, error } = await supabase
        .from("micro_actions")
        .insert({
          user_id: userId,
          title: microActionData.title,
          description: microActionData.description || null,
          category: microActionData.category,
          duration: microActionData.duration,
          frequency: microActionData.frequency,
          time_of_day: microActionData.timeOfDay || null,
          habit_stack: microActionData.habitStack || null,
          is_active: microActionData.isActive,
        })
        .select()
        .single()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

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
