import { supabase } from "./supabase/client"
import type { User } from "@supabase/supabase-js"

export class SupabaseAuthService {
  static async signUp(email: string, password: string) {
    if (!supabase) throw new Error("Supabase client not available")
    return await supabase.auth.signUp({ email, password })
  }

  static async signIn(email: string, password: string) {
    if (!supabase) throw new Error("Supabase client not available")
    return await supabase.auth.signInWithPassword({ email, password })
  }

  static async signOut() {
    if (!supabase) throw new Error("Supabase client not available")
    return await supabase.auth.signOut()
  }

  static async getUser(): Promise<User | null> {
    if (!supabase) return null
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  }

  static async getSession() {
    if (!supabase) return null
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  }
}

// Export default instance
export default SupabaseAuthService
