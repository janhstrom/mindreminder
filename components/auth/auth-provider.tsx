"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authService, type AuthUser } from "@/lib/auth-supabase" // Ensure this path is correct
import { useRouter, usePathname } from "next/navigation" // usePathname for redirect logic

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: Error | null
  signUp: typeof authService.signUp
  signIn: typeof authService.signIn
  signInWithGoogle: typeof authService.signInWithGoogle
  signOut: () => Promise<void> // Modified signOut
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
      setUser(null) // Clear user state immediately
      // No need to push here, onAuthStateChange or useEffect below will handle it
    } catch (err) {
      console.error("SignOut Error in AuthProvider:", err)
      setError(err instanceof Error ? err : new Error("Sign out failed"))
      // Potentially show a toast to the user
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    authService
      .getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser)
      })
      .catch((err) => {
        console.error("Error getting current user:", err)
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })

    const { data: authListener } = authService.onAuthStateChange((authUser) => {
      console.log("AuthProvider onAuthStateChange, user:", authUser?.email)
      setUser(authUser)
      setLoading(false)
      if (!authUser && !["/login", "/register", "/"].includes(pathname)) {
        // If user becomes null and not on public pages, redirect to login
        console.log("Redirecting to /login due to auth state change (user became null)")
        router.push("/login")
      } else if (authUser && (pathname === "/login" || pathname === "/register")) {
        // If user exists and on login/register, redirect to dashboard
        console.log("Redirecting to /dashboard due to auth state change (user exists)")
        router.push("/dashboard")
      }
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [router, pathname]) // Add router and pathname as dependencies

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
