"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authService, type AuthUser } from "@/lib/auth-supabase" // Ensure this path is correct
import { useRouter, usePathname } from "next/navigation"
import type { Session } from "@supabase/supabase-js"

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
        console.log("AuthProvider (mount): Current user:", currentUser?.email)
      })
      .catch((err) => {
        console.error("AuthProvider (mount): Error getting current user:", err)
      })
      .finally(() => {
        setLoading(false)
      })

    const {
      data: { subscription },
    } = authService.onAuthStateChange((event, session: Session | null) => {
      console.log(`AuthProvider (onAuthStateChange): Event: ${event}, Path: ${pathname}`)
      console.log("AuthProvider (onAuthStateChange): Full session object:", session)

      const supabaseUser = session?.user ?? null

      // Transform Supabase user to AuthUser if needed, or ensure AuthUser matches Supabase User structure
      // For now, let's assume AuthUser is compatible or a superset of Supabase's User
      const appUser = supabaseUser
        ? ({
            id: supabaseUser.id,
            email: supabaseUser.email,
            // Add other fields from your AuthUser type that exist on supabaseUser
            // e.g., user_metadata, app_metadata if you use them
            ...supabaseUser.user_metadata, // Spread user_metadata if it contains first_name, last_name etc.
          } as AuthUser)
        : null

      console.log("AuthProvider (onAuthStateChange): Derived appUser:", appUser)
      setUser(appUser)
      setLoading(false)

      const isAuthPage = pathname === "/login" || pathname === "/register"
      const isPublicPage = isAuthPage || pathname === "/"

      if (appUser && isAuthPage) {
        console.log("AuthProvider (onAuthStateChange): User signed in and on auth page, redirecting to /dashboard")
        router.push("/dashboard")
      } else if (!appUser && !isPublicPage) {
        console.log("AuthProvider (onAuthStateChange): User signed out and not on public page, redirecting to /login")
        router.push("/login")
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
      const { data, error: signInError } = await authService.signIn(email, password)
      console.log("AuthProvider (handleSignIn): Supabase signin response:", { data, error: signInError })
      if (signInError) throw signInError
      if (data.user) {
        console.log("AuthProvider (handleSignIn): User signed in successfully:", data.user)
        // onAuthStateChange should handle setting user and redirecting
      } else {
        throw new Error("Sign-in successful but no user data returned.")
      }
    } catch (err: any) {
      console.error("AuthProvider (handleSignIn): SignIn error", err)
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
      const { data, error: signUpError } = await authService.signUp(email, password, firstName, lastName)
      console.log("AuthProvider (handleSignUp): Supabase signup response:", { data, error: signUpError })
      if (signUpError) throw signUpError
      if (data.user) {
        console.log("AuthProvider (handleSignUp): User signed up successfully:", data.user)
        // onAuthStateChange should handle setting user and redirecting
      } else if (!data.session && !data.user) {
        // Check if it's a "user already registered" type of scenario if no error
        console.warn(
          "AuthProvider (handleSignUp): Sign up did not return a user or session, but no explicit error. User might exist or email confirmation pending.",
        )
        // Potentially set a specific message for the user
      }
    } catch (err: any) {
      console.error("AuthProvider (handleSignUp): SignUp error", err)
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
      // onAuthStateChange will handle redirect
    } catch (err: any) {
      console.error("AuthProvider (handleSignInWithGoogle): Google SignIn error", err)
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
      throw err
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
