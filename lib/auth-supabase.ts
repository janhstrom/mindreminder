"use client"

import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"
import type { Database } from "./supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImage?: string
  createdAt: Date
}

export class SupabaseAuthService {
  private static instance: SupabaseAuthService

  static getInstance(): SupabaseAuthService {
    if (!SupabaseAuthService.instance) {
      SupabaseAuthService.instance = new SupabaseAuthService()
    }
    return SupabaseAuthService.instance
  }

  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<AuthUser> {
    console.log("Attempting to sign up user:", email)

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

    console.log("Supabase signup response:", { data, error })

    if (error) {
      console.error("Signup error:", error)
      throw error
    }
    if (!data.user) {
      console.error("No user returned from signup")
      throw new Error("No user returned")
    }

    console.log("User created successfully:", data.user)

    // The profile is created automatically via trigger
    return this.mapUserToAuthUser(data.user, { first_name: firstName, last_name: lastName })
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    if (!data.user) throw new Error("No user returned")

    const profile = await this.getProfile(data.user.id)
    return this.mapUserToAuthUser(data.user, profile)
  }

  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) throw error
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

    const profile = await this.getProfile(user.id)
    return this.mapUserToAuthUser(user, profile)
  }

  async updateProfile(updates: Partial<AuthUser>): Promise<AuthUser> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        profile_image: updates.profileImage,
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) throw error

    return this.mapUserToAuthUser(user, data)
  }

  private async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  }

  private mapUserToAuthUser(user: User, profile: Partial<Profile> | null): AuthUser {
    return {
      id: user.id,
      email: user.email!,
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      profileImage: profile?.profile_image || undefined,
      createdAt: new Date(user.created_at),
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getProfile(session.user.id)
        const authUser = this.mapUserToAuthUser(session.user, profile)
        callback(authUser)
      } else {
        callback(null)
      }
    })
  }
}

// Export the singleton instance
export const authService = SupabaseAuthService.getInstance()
