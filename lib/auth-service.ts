import { supabase } from "./supabase"

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImage?: string
  createdAt: Date
}

class AuthService {
  private static instance: AuthService

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (error) throw error
    if (!data.user) throw new Error("No user returned")

    return {
      id: data.user.id,
      email: data.user.email!,
      firstName,
      lastName,
      createdAt: new Date(data.user.created_at),
    }
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    if (!data.user) throw new Error("No user returned")

    // Get profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, profile_image")
      .eq("id", data.user.id)
      .single()

    return {
      id: data.user.id,
      email: data.user.email!,
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      profileImage: profile?.profile_image || undefined,
      createdAt: new Date(data.user.created_at),
    }
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, profile_image")
      .eq("id", user.id)
      .single()

    return {
      id: user.id,
      email: user.email!,
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      profileImage: profile?.profile_image || undefined,
      createdAt: new Date(user.created_at),
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = AuthService.getInstance()
