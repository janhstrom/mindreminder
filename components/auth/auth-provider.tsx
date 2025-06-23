"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { SupabaseAuthService, type AuthUser } from "@/lib/auth-supabase"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      try {
        const currentUser = await SupabaseAuthService.getInstance().getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error getting initial user:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = SupabaseAuthService.getInstance().onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const user = await SupabaseAuthService.getInstance().signIn(email, password)
    setUser(user)
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const user = await SupabaseAuthService.getInstance().signUp(email, password, firstName, lastName)
    setUser(user)
  }

  const signOut = async () => {
    await SupabaseAuthService.getInstance().signOut()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
