"use client"

import { supabase } from "./supabase"
import { DEMO_USER_ID } from "./auth-fallback"

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
    // Just return the hardcoded demo user ID
    // RLS is disabled so this should work regardless of whether the user exists in profiles
    console.log("✅ Using demo user ID:", DEMO_USER_ID)
    return DEMO_USER_ID
  }
}

export class DashboardDataService {
  static async getStats(userId?: string): Promise<DashboardStats> {
    try {
      const actualUserId = userId || DEMO_USER_ID

      // Get reminders count
      const { count: remindersCount, error: remindersError } = await supabase
        .from("reminders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", actualUserId)
        .eq("is_active", true)

      if (remindersError) {
        console.error("Error counting reminders:", remindersError)
      }

      // Get micro-actions count
      const { count: habitsCount, error: habitsError } = await supabase
        .from("micro_actions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", actualUserId)
        .eq("is_active", true)

      if (habitsError) {
        console.error("Error counting habits:", habitsError)
      }

      // Get best streak
      const { data: bestStreakData, error: streakError } = await supabase
        .from("micro_actions")
        .select("best_streak")
        .eq("user_id", actualUserId)
        .order("best_streak", { ascending: false })
        .limit(1)

      if (streakError) {
        console.error("Error getting best streak:", streakError)
      }

      // Get today's completions
      const today = new Date().toISOString().split("T")[0]
      const { count: completedTodayCount, error: completionsError } = await supabase
        .from("micro_action_completions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", actualUserId)
        .eq("completion_date", today)

      if (completionsError) {
        console.error("Error counting completions:", completionsError)
      }

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
      const actualUserId = userId || DEMO_USER_ID

      const { data, error } = await supabase
        .from("reminders")
        .select("id, title, description, scheduled_time, is_active, created_at")
        .eq("user_id", actualUserId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching reminders:", error)
        return []
      }

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
      const actualUserId = userId || DEMO_USER_ID

      const { data, error } = await supabase
        .from("micro_actions")
        .select("id, title, category, current_streak, is_active")
        .eq("user_id", actualUserId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching micro-actions:", error)
        return []
      }

      // Check today's completions
      const today = new Date().toISOString().split("T")[0]
      const { data: completions, error: completionsError } = await supabase
        .from("micro_action_completions")
        .select("micro_action_id")
        .eq("user_id", actualUserId)
        .eq("completion_date", today)

      if (completionsError) {
        console.error("Error fetching completions:", completionsError)
      }

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
      console.log("🔄 Creating reminder with data:", reminderData)

      const userId = DEMO_USER_ID
      console.log("👤 Using user ID:", userId)

      const insertData = {
        user_id: userId,
        title: reminderData.title,
        description: reminderData.description || null,
        scheduled_time: reminderData.scheduledTime || null,
        location: reminderData.location || null,
        image: reminderData.image || null,
        is_active: reminderData.isActive,
      }

      console.log("📝 Inserting data:", insertData)

      const { data, error } = await supabase.from("reminders").insert(insertData).select().single()

      if (error) {
        console.error("❌ Supabase insert error:", error)
        throw new Error(`Failed to create reminder: ${error.message}`)
      }

      if (!data) {
        console.error("❌ No data returned from insert")
        throw new Error("No data returned from database")
      }

      console.log("✅ Reminder created successfully:", data)

      return {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        scheduledTime: data.scheduled_time || undefined,
        isActive: data.is_active,
        createdAt: data.created_at,
      }
    } catch (error) {
      console.error("💥 Error creating reminder:", error)
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
      console.log("🔄 Creating micro-action with data:", microActionData)

      const userId = DEMO_USER_ID
      console.log("👤 Using user ID:", userId)

      const insertData = {
        user_id: userId,
        title: microActionData.title,
        description: microActionData.description || null,
        category: microActionData.category,
        duration: microActionData.duration,
        frequency: microActionData.frequency,
        time_of_day: microActionData.timeOfDay || null,
        habit_stack: microActionData.habitStack || null,
        is_active: microActionData.isActive,
      }

      console.log("📝 Inserting data:", insertData)

      const { data, error } = await supabase.from("micro_actions").insert(insertData).select().single()

      if (error) {
        console.error("❌ Supabase insert error:", error)
        throw new Error(`Failed to create micro-action: ${error.message}`)
      }

      if (!data) {
        console.error("❌ No data returned from insert")
        throw new Error("No data returned from database")
      }

      console.log("✅ Micro-action created successfully:", data)

      return {
        id: data.id,
        title: data.title,
        category: data.category,
        currentStreak: data.current_streak || 0,
        completedToday: false,
        isActive: data.is_active,
      }
    } catch (error) {
      console.error("💥 Error creating micro-action:", error)
      throw error
    }
  }
}
