"use client"

import { supabase } from "./supabase"
import type { Database } from "./supabase"

type MicroActionRow = Database["public"]["Tables"]["micro_actions"]["Row"]
type MicroActionInsert = Database["public"]["Tables"]["micro_actions"]["Insert"]
type MicroActionUpdate = Database["public"]["Tables"]["micro_actions"]["Update"]

export interface MicroAction {
  id: string
  userId: string
  title: string
  description?: string
  category: string
  duration: string
  frequency: string
  timeOfDay?: string
  habitStack?: string
  isActive: boolean
  currentStreak: number
  bestStreak: number
  totalCompletions: number
  completedToday?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MicroActionCompletion {
  id: string
  microActionId: string
  userId: string
  completedAt: Date
  completionDate: string
  notes?: string
}

export class MicroActionService {
  private static instance: MicroActionService

  static getInstance(): MicroActionService {
    if (!MicroActionService.instance) {
      MicroActionService.instance = new MicroActionService()
    }
    return MicroActionService.instance
  }

  async getMicroActions(userId: string): Promise<MicroAction[]> {
    const { data, error } = await supabase
      .from("micro_actions")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Get today's completions to check if completed today
    const today = new Date().toISOString().split("T")[0]
    const { data: completions } = await supabase
      .from("micro_action_completions")
      .select("micro_action_id")
      .eq("user_id", userId)
      .eq("completion_date", today)

    const completedToday = new Set(completions?.map((c) => c.micro_action_id) || [])

    return data.map((row) => ({
      ...this.mapRowToMicroAction(row),
      completedToday: completedToday.has(row.id),
    }))
  }

  async createMicroAction(
    userId: string,
    microActionData: Omit<
      MicroAction,
      "id" | "userId" | "currentStreak" | "bestStreak" | "totalCompletions" | "createdAt" | "updatedAt"
    >,
  ): Promise<MicroAction> {
    const insertData: MicroActionInsert = {
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

    const { data, error } = await supabase.from("micro_actions").insert(insertData).select().single()

    if (error) throw error

    return this.mapRowToMicroAction(data)
  }

  async updateMicroAction(userId: string, microActionId: string, updates: Partial<MicroAction>): Promise<MicroAction> {
    const updateData: MicroActionUpdate = {}

    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description || null
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.duration !== undefined) updateData.duration = updates.duration
    if (updates.frequency !== undefined) updateData.frequency = updates.frequency
    if (updates.timeOfDay !== undefined) updateData.time_of_day = updates.timeOfDay || null
    if (updates.habitStack !== undefined) updateData.habit_stack = updates.habitStack || null
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive

    const { data, error } = await supabase
      .from("micro_actions")
      .update(updateData)
      .eq("id", microActionId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) throw error

    return this.mapRowToMicroAction(data)
  }

  async deleteMicroAction(userId: string, microActionId: string): Promise<void> {
    const { error } = await supabase.from("micro_actions").delete().eq("id", microActionId).eq("user_id", userId)

    if (error) throw error
  }

  async completeMicroAction(userId: string, microActionId: string, notes?: string): Promise<void> {
    const today = new Date().toISOString().split("T")[0]

    // Check if already completed today
    const { data: existing } = await supabase
      .from("micro_action_completions")
      .select("id")
      .eq("micro_action_id", microActionId)
      .eq("completion_date", today)
      .single()

    if (existing) {
      throw new Error("Already completed today")
    }

    // Insert completion record
    const { error: insertError } = await supabase.from("micro_action_completions").insert({
      micro_action_id: microActionId,
      user_id: userId,
      completion_date: today,
      notes: notes || null,
    })

    if (insertError) throw insertError

    // Update streak using the database function
    const { error: streakError } = await supabase.rpc("update_micro_action_streak", {
      action_id: microActionId,
      user_id_param: userId,
    })

    if (streakError) throw streakError
  }

  async uncompleteMicroAction(userId: string, microActionId: string): Promise<void> {
    const today = new Date().toISOString().split("T")[0]

    // Delete completion record
    const { error: deleteError } = await supabase
      .from("micro_action_completions")
      .delete()
      .eq("micro_action_id", microActionId)
      .eq("user_id", userId)
      .eq("completion_date", today)

    if (deleteError) throw deleteError

    // Recalculate streak (simplified - just decrement)
    const { error: updateError } = await supabase
      .from("micro_actions")
      .update({
        current_streak: Math.max(0, supabase.sql`current_streak - 1`),
        total_completions: Math.max(0, supabase.sql`total_completions - 1`),
      })
      .eq("id", microActionId)
      .eq("user_id", userId)

    if (updateError) throw updateError
  }

  async getMicroActionStats(userId: string): Promise<{
    totalActive: number
    completedToday: number
    currentStreaks: number[]
    weeklyCompletions: number
  }> {
    // Get active micro-actions
    const { data: actions, error: actionsError } = await supabase
      .from("micro_actions")
      .select("id, current_streak")
      .eq("user_id", userId)
      .eq("is_active", true)

    if (actionsError) throw actionsError

    // Get today's completions
    const today = new Date().toISOString().split("T")[0]
    const { data: todayCompletions, error: todayError } = await supabase
      .from("micro_action_completions")
      .select("id")
      .eq("user_id", userId)
      .eq("completion_date", today)

    if (todayError) throw todayError

    // Get this week's completions
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoStr = weekAgo.toISOString().split("T")[0]

    const { data: weekCompletions, error: weekError } = await supabase
      .from("micro_action_completions")
      .select("id")
      .eq("user_id", userId)
      .gte("completion_date", weekAgoStr)

    if (weekError) throw weekError

    return {
      totalActive: actions?.length || 0,
      completedToday: todayCompletions?.length || 0,
      currentStreaks: actions?.map((a) => a.current_streak) || [],
      weeklyCompletions: weekCompletions?.length || 0,
    }
  }

  private mapRowToMicroAction(row: MicroActionRow): MicroAction {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description || undefined,
      category: row.category,
      duration: row.duration,
      frequency: row.frequency,
      timeOfDay: row.time_of_day || undefined,
      habitStack: row.habit_stack || undefined,
      isActive: row.is_active,
      currentStreak: row.current_streak,
      bestStreak: row.best_streak,
      totalCompletions: row.total_completions,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }
}

// Export singleton instance
export const microActionService = MicroActionService.getInstance()
