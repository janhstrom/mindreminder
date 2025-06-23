import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          profile_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          profile_image?: string | null
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          profile_image?: string | null
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          image: string | null
          scheduled_time: string | null
          location: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          description?: string | null
          image?: string | null
          scheduled_time?: string | null
          location?: string | null
          is_active?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          image?: string | null
          scheduled_time?: string | null
          location?: string | null
          is_active?: boolean
        }
      }
      quotes: {
        Row: {
          id: string
          user_id: string
          content: string
          topic: string
          author: string
          is_favorite: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          content: string
          topic: string
          author: string
          is_favorite?: boolean
        }
        Update: {
          is_favorite?: boolean
        }
      }
      micro_actions: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          duration: string
          frequency: string
          time_of_day: string | null
          habit_stack: string | null
          is_active: boolean
          current_streak: number
          best_streak: number
          total_completions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          description?: string | null
          category: string
          duration: string
          frequency?: string
          time_of_day?: string | null
          habit_stack?: string | null
          is_active?: boolean
        }
        Update: {
          title?: string
          description?: string | null
          category?: string
          duration?: string
          frequency?: string
          time_of_day?: string | null
          habit_stack?: string | null
          is_active?: boolean
        }
      }
      micro_action_completions: {
        Row: {
          id: string
          micro_action_id: string
          user_id: string
          completed_at: string
          completion_date: string
          notes: string | null
        }
        Insert: {
          micro_action_id: string
          user_id: string
          completion_date?: string
          notes?: string | null
        }
        Update: {
          notes?: string | null
        }
      }
    }
  }
}
