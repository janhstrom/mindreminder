"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authService, type AuthUser } from "@/lib/auth-supabase" // Ensure this path is correct
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
    } = authService.onAuthStateChange((appUser, session) => {
      // session is now also passed
      console.log(`AuthProvider (onAuthStateChange): Event received. User: ${appUser?.email}, Path: ${pathname}`)
      // The rest of the onAuthStateChange logic using appUser remains similar
      // setUser(appUser) is already being done based on appUser
      // ... (keep existing redirection logic) ...
      setUser(appUser) // Explicitly set user state
      setLoading(false)

      const isAuthPage = pathname === "/login" || pathname === "/register"
      const isPublicPage = isAuthPage || pathname === "/"

      if (appUser && isAuthPage) {
        console.log("AuthProvider (onAuthStateChange): User authenticated and on auth page, redirecting to /dashboard")
        router.push("/dashboard")
      } else if (!appUser && !isPublicPage) {
        console.log(
          "AuthProvider (onAuthStateChange): User not authenticated and not on public page, redirecting to /login",
        )
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
      const response = await authService.signIn(email, password)
      console.log("AuthProvider (handleSignIn): authService response:", response)

      if (response.error) {
        throw response.error
      }
      if (response.user) {
        console.log("AuthProvider (handleSignIn): User signed in successfully via authService:", response.user.email)
        // onAuthStateChange should handle setting the user state and redirection
      } else {
        throw new Error("Sign-in successful according to authService but no user data returned to AuthProvider.")
      }
    } catch (err: any) {
      console.error("AuthProvider (handleSignIn): SignIn error caught", err)
      setError(err instanceof Error ? err : new Error(err.message || "Sign-in failed"))
    } finally {
      setOperationLoading(false)
    }
  }, [])

  const handleSignUp = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    setOperationLoading(true)
    setError(null)
    try {
      const response = await authService.signUp(email, password, firstName, lastName)
      console.log("AuthProvider (handleSignUp): authService response:", response)

      if (response.error) {
        throw response.error
      }
      if (response.user) {
        console.log("AuthProvider (handleSignUp): User signed up successfully via authService:", response.user.email)
        // onAuthStateChange will handle setting the user state and redirection
      } else {
        console.warn("AuthProvider (handleSignUp): SignUp call to authService returned no user and no error.")
      }
    } catch (err: any) {
      console.error("AuthProvider (handleSignUp): SignUp error caught", err)
      setError(err instanceof Error ? err : new Error(err.message || "Sign-up failed"))
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
      const { error } = await authService.signOut()
      if (error) {
        throw error
      }
      console.log("AuthProvider: authService.signOut completed.")
      // onAuthStateChange will set user to null and handle redirect.
    } catch (err: any) {
      console.error("AuthProvider: SignOut error", err)
      setError(err instanceof Error ? err : new Error(err.message || "Sign out failed"))
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
