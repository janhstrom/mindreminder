"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, type AuthUser } from "@/lib/auth-supabase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  signOut: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    // Get initial user
    const getInitialUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        console.log("Initial user:", currentUser)
        if (mounted) {
          setUser(currentUser)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error getting initial user:", error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    getInitialUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange((user) => {
      console.log("Auth state changed:", user)
      if (mounted) {
        setUser(user)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const user = await authService.signIn(email, password)
      setUser(user)
      setLoading(false)
      // Use router instead of window.location for better React handling
      router.push("/dashboard")
    } catch (error) {
      setLoading(false)
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true)
      const user = await authService.signUp(email, password, firstName, lastName)
      setUser(user)
      setLoading(false)
      // Use window.location for reliable redirect
      window.location.href = "/dashboard"
    } catch (error) {
      setLoading(false)
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      // Use window.location for reliable redirect
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  const logout = signOut // Alias for backward compatibility

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
