"use client"

import type { User } from "@/types"

// Simple client-side auth simulation
// In production, use proper authentication like NextAuth.js or Supabase Auth

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists in localStorage
    const users = this.getStoredUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      throw new Error("User not found")
    }

    this.currentUser = user
    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = this.getStoredUsers()

    if (users.find((u) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      firstName,
      lastName,
      createdAt: new Date(),
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    this.currentUser = newUser
    localStorage.setItem("currentUser", JSON.stringify(newUser))

    return newUser
  }

  logout(): void {
    this.currentUser = null
    localStorage.removeItem("currentUser")
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    const stored = localStorage.getItem("currentUser")
    if (stored) {
      this.currentUser = JSON.parse(stored)
      return this.currentUser
    }

    return null
  }

  updateProfile(updates: Partial<User>): User {
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

  private getStoredUsers(): User[] {
    const stored = localStorage.getItem("users")
    return stored ? JSON.parse(stored) : []
  }
}
