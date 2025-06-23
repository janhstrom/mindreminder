import { supabase } from "@/lib/supabaseClient"

export interface SimpleReminder {
  id: string
  title: string
  description?: string
  scheduledTime?: string
  location?: string
  image?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SimpleMicroAction {
  id: string
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
  completedToday: boolean
  createdAt: string
  updatedAt: string
}

export class DashboardDataService {
  static async createReminder(reminderData: {
    title: string
    description?: string
    scheduledTime?: string
    location?: string
    image?: string
    isActive: boolean
  }): Promise<SimpleReminder> {
    const { data, error } = await supabase
      .from("reminders")
      .insert({
        user_id: "demo-user", // For now, using demo user
        title: reminderData.title,
        description: reminderData.description || null,
        scheduled_time: reminderData.scheduledTime || null,
        location: reminderData.location || null,
        image: reminderData.image || null,
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
      location: data.location || undefined,
      image: data.image || undefined,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
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
    const { data, error } = await supabase
      .from("micro_actions")
      .insert({
        user_id: "demo-user", // For now, using demo user
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

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      category: data.category,
      duration: data.duration,
      frequency: data.frequency,
      timeOfDay: data.time_of_day || undefined,
      habitStack: data.habit_stack || undefined,
      isActive: data.is_active,
      currentStreak: data.current_streak,
      bestStreak: data.best_streak,
      totalCompletions: data.total_completions,
      completedToday: false, // Will be calculated separately
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }
}
