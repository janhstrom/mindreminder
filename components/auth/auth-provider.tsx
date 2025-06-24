"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authService, type AuthUser } from "@/lib/auth-supabase" // Ensure this path is correct
import { useRouter } from "next/navigation" // Use next/navigation

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    setLoading(true)
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      setError("Failed to fetch user")
      console.error("Error fetching user:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()

    const { data: authListener } = authService.onAuthStateChange((_event, session) => {
      const currentUser = session?.user as AuthUser | null
      setUser(currentUser || null)
      setLoading(false)
      if (!currentUser) {
        // Optional: redirect to login if no user and not on public pages
        // const publicPaths = ['/', '/login', '/register'];
        // if (!publicPaths.includes(window.location.pathname)) {
        //   router.push('/login');
        // }
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [fetchUser, router])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const signedInUser = await authService.signIn(email, password)
      setUser(signedInUser) // Update user state immediately
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Sign-in failed")
      console.error("Sign-in error:", err)
      throw err // Re-throw to be caught in form
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true)
    setError(null)
    try {
      const signedUpUser = await authService.signUp(email, password, firstName, lastName)
      setUser(signedUpUser) // Update user state immediately
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Sign-up failed")
      console.error("Sign-up error:", err)
      throw err // Re-throw to be caught in form
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)
    try {
      await authService.signOut()
      setUser(null) // Update user state immediately
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Sign-out failed")
      console.error("Sign-out error:", err)
      throw err // Re-throw to be caught in form
    } finally {
      setLoading(false)
    }
  }

  const value = { user, loading, error, signIn, signUp, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // This error is a common source of React error #130 if AuthProvider is not wrapping the component using useAuth
    throw new Error("useAuth must be used within an AuthProvider. Make sure your component is a child of AuthProvider.")
  }
  return context
}
