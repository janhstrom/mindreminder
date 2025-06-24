"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authService, type AuthUser } from "@/lib/auth-supabase"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean // General loading for initial auth state detection
  operationLoading: boolean // Specific loading for signIn, signUp, signOut operations
  error: Error | null
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: typeof authService.updateProfile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    authService
      .getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser)
        console.log("AuthProvider: Current user found on mount:", currentUser?.email)
      })
      .catch((err) => {
        console.error("AuthProvider: Error getting current user on mount:", err)
      })
      .finally(() => {
        setLoading(false)
      })

    const {
      data: { subscription },
    } = authService.onAuthStateChange((event, session) => {
      const authUser = session?.user as AuthUser | null
      console.log(`AuthProvider: Auth state change: ${event}, User: ${authUser?.id}, Path: ${pathname}`)
      setUser(authUser)
      setLoading(false)

      const isAuthPage = pathname === "/login" || pathname === "/register"
      const isPublicPage = isAuthPage || pathname === "/"

      if (event === "SIGNED_IN" && isAuthPage) {
        router.push("/dashboard")
      } else if (event === "SIGNED_OUT" && !isPublicPage) {
        router.push("/login")
      } else if (authUser && isAuthPage) {
        // If user is somehow already logged in and on auth page
        router.push("/dashboard")
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [pathname, router])

  const handleSignIn = useCallback(async (email: string, password: string) => {
    setOperationLoading(true)
    setError(null)
    try {
      await authService.signIn(email, password)
    } catch (err: any) {
      console.error("AuthProvider: SignIn error", err)
      setError(err instanceof Error ? err : new Error(err.message || "Sign-in failed"))
      throw err
    } finally {
      setOperationLoading(false)
    }
  }, [])

  const handleSignUp = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    setOperationLoading(true)
    setError(null)
    try {
      await authService.signUp(email, password, firstName, lastName)
    } catch (err: any) {
      console.error("AuthProvider: SignUp error", err)
      setError(err instanceof Error ? err : new Error(err.message || "Sign-up failed"))
      throw err
    } finally {
      setOperationLoading(false)
    }
  }, [])

  const handleSignInWithGoogle = useCallback(async () => {
    setOperationLoading(true)
    setError(null)
    try {
      await authService.signInWithGoogle()
    } catch (err: any) {
      console.error("AuthProvider: Google SignIn error", err)
      setError(err instanceof Error ? err : new Error(err.message || "Google Sign-in failed"))
      throw err
    } finally {
      setOperationLoading(false)
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    console.log("AuthProvider: Attempting sign out...")
    setOperationLoading(true)
    setError(null)
    try {
      await authService.signOut()
      console.log("AuthProvider: authService.signOut completed.")
      // onAuthStateChange will set user to null and handle redirect.
    } catch (err: any) {
      console.error("AuthProvider: SignOut error", err)
      setError(err instanceof Error ? err : new Error(err.message || "Sign out failed"))
      throw err // Re-throw to allow UI to potentially handle it
    } finally {
      setOperationLoading(false)
      console.log("AuthProvider: Sign out operation finished (finally block).")
    }
  }, [])

  const contextValue: AuthContextType = {
    user,
    loading,
    operationLoading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
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
