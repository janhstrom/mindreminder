"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authService, type AuthUser } from "@/lib/auth-supabase"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: Error | null
  signUp: typeof authService.signUp
  signIn: typeof authService.signIn
  signInWithGoogle: typeof authService.signInWithGoogle
  signOut: () => Promise<void>
  updateProfile: typeof authService.updateProfile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = useCallback(async () => {
    try {
      await authService.signOut()
      // The onAuthStateChange listener will handle setting user to null and redirecting.
    } catch (err) {
      console.error("SignOut Error in AuthProvider:", err)
      setError(err instanceof Error ? err : new Error("Sign out failed"))
    }
  }, [])

  useEffect(() => {
    // Initial check for user on mount
    authService
      .getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser)
      })
      .finally(() => {
        setLoading(false)
      })

    // Set up the auth state change listener
    const {
      data: { subscription },
    } = authService.onAuthStateChange((authUser) => {
      setUser(authUser)
      setLoading(false) // Stop loading once we have auth state

      const isAuthPage = pathname === "/login" || pathname === "/register"
      const isPublicPage = isAuthPage || pathname === "/"

      if (authUser && isAuthPage) {
        // If user is logged in and on an auth page, redirect to dashboard
        router.push("/dashboard")
      } else if (!authUser && !isPublicPage) {
        // If user is not logged in and not on a public page, redirect to login
        router.push("/login")
      }
    })

    // Cleanup function to unsubscribe from the listener
    return () => {
      subscription?.unsubscribe()
    }
  }, [pathname, router])

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signInWithGoogle: authService.signInWithGoogle,
    signOut: handleSignOut,
    updateProfile: authService.updateProfile,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
