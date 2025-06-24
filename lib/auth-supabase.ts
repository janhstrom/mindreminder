"use client"

import { supabase } from "./supabase"
import type { User as SupabaseUser, AuthError } from "@supabase/supabase-js"
import type { Database } from "./supabase"

export interface AuthUser {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  profileImage?: string
  createdAt: string
  emailConfirmed?: boolean
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export class SupabaseAuthService {
  private static instance: SupabaseAuthService

  static getInstance(): SupabaseAuthService {
    if (!SupabaseAuthService.instance) {
      SupabaseAuthService.instance = new SupabaseAuthService()
    }
    return SupabaseAuthService.instance
  }

  private mapSupabaseUserToAuthUser(supabaseUser: SupabaseUser, profile?: Partial<Profile> | null): AuthUser {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      firstName: profile?.first_name || supabaseUser.user_metadata?.first_name || "",
      lastName: profile?.last_name || supabaseUser.user_metadata?.last_name || "",
      profileImage: profile?.profile_image || supabaseUser.user_metadata?.profile_image || undefined,
      createdAt: supabaseUser.created_at,
      emailConfirmed: !!supabaseUser.email_confirmed_at,
    }
  }

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    console.log("authService: Attempting to sign up user:", email)
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

    console.log("authService: Supabase signup response:", { data, error })

    if (error) {
      console.error("authService: Signup error:", error)
      return { user: null, error }
    }

    if (data?.user) {
      console.log("authService: User record created successfully in auth.users:", data.user.id)
      const authUser = this.mapSupabaseUserToAuthUser(data.user, {
        first_name: firstName,
        last_name: lastName,
      })
      return { user: authUser, error: null }
    }

    console.warn("authService: Signup completed but no user object returned, and no explicit error.")
    return { user: null, error: new Error("Signup completed but no user object returned.") as AuthError }
  }

  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    console.log("authService: Attempting to sign in user:", email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("authService: Supabase signin response:", { data, error })

    if (error) {
      console.error("authService: Signin error:", error)
      return { user: null, error }
    }

    if (data?.user) {
      console.log("authService: User signed in successfully:", data.user.id)
      const profile = await this.getProfile(data.user.id)
      const authUser = this.mapSupabaseUserToAuthUser(data.user, profile)
      return { user: authUser, error: null }
    }

    console.error("authService: Signin successful but no user object in response.")
    return { user: null, error: new Error("Signin successful but no user object returned.") as AuthError }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    console.log("authService: Signing out user")
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("authService: Signout error:", error)
    } else {
      console.log("authService: User signed out successfully from Supabase.")
    }
    return { error }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) {
      return null
    }
    const profile = await this.getProfile(session.user.id)
    return this.mapSupabaseUserToAuthUser(session.user, profile)
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`authService (onAuthStateChange): Event: ${event}, User ID: ${session?.user?.id}`)
      if (session?.user) {
        const profile = await this.getProfile(session.user.id)
        const authUser = this.mapSupabaseUserToAuthUser(session.user, profile)
        callback(authUser)
      } else {
        callback(null)
      }
    })
  }

  // Other methods like signInWithGoogle, updateProfile, etc. would go here
  // For brevity, they are omitted but should follow the same robust return pattern.
  private async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
      if (error) {
        console.warn(`authService: Could not fetch profile for ${userId}:`, error.message)
        return null
      }
      return data
    } catch (catchError: any) {
      console.error(`authService: Exception in getProfile for ${userId}:`, catchError.message)
      return null
    }
  }
}

export const authService = SupabaseAuthService.getInstance()
