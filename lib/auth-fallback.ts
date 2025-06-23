"use client"

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
  private currentUser: AuthUser | null = null

  static getInstance(): SupabaseAuthService {
    if (!SupabaseAuthService.instance) {
      SupabaseAuthService.instance = new SupabaseAuthService()
    }
    return SupabaseAuthService.instance
  }

  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<AuthUser> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const users = this.getStoredUsers()
    if (users.find((u) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser: AuthUser = {
      id: Date.now().toString(),
      email,
      firstName,
      lastName,
      createdAt: new Date(),
    }

    // Store user in localStorage
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Set as current user
    this.currentUser = newUser
    localStorage.setItem("currentUser", JSON.stringify(newUser))

    return newUser
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = this.getStoredUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      throw new Error("User not found")
    }

    // Set as current user
    this.currentUser = user
    localStorage.setItem("currentUser", JSON.stringify(user))

    return user
  }

  async signInWithGoogle(): Promise<void> {
    // Fallback implementation - create a demo Google user
    const demoUser: AuthUser = {
      id: "google-" + Date.now().toString(),
      email: "demo@google.com",
      firstName: "Google",
      lastName: "User",
      createdAt: new Date(),
    }

    this.currentUser = demoUser
    localStorage.setItem("currentUser", JSON.stringify(demoUser))
  }

  async signOut(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem("currentUser")
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (this.currentUser) return this.currentUser

    // Check localStorage for persisted user
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser")
      if (stored) {
        this.currentUser = JSON.parse(stored)
        return this.currentUser
      }
    }

    return null
  }

  async updateProfile(updates: Partial<AuthUser>): Promise<AuthUser> {
    if (!this.currentUser) throw new Error("Not authenticated")

    const updatedUser = { ...this.currentUser, ...updates }
    this.currentUser = updatedUser
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Update in users list
    const users = this.getStoredUsers()
    const userIndex = users.findIndex((u) => u.id === updatedUser.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem("users", JSON.stringify(users))
    }

    return updatedUser
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    // Simulate auth state change listener
    const checkAuth = () => {
      const user = this.getCurrentUser()
      callback(user)
    }

    // Check immediately
    checkAuth()

    // Return subscription object
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            // Cleanup if needed
          },
        },
      },
    }
  }

  private getStoredUsers(): AuthUser[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("users")
    return stored ? JSON.parse(stored) : []
  }
}
