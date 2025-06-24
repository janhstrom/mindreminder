"use client"

// Simple auth fallback for demo purposes
const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

export async function getDemoUserId(): Promise<string> {
  // Just return the hardcoded demo user ID
  // The database script will try to create this user, but if it fails due to constraints,
  // we'll still use this ID and the app should work since RLS is disabled
  console.log("✅ Using demo user ID:", DEMO_USER_ID)
  return DEMO_USER_ID
}

export function getCurrentUser() {
  return {
    id: DEMO_USER_ID,
    email: "demo@mindreminder.com",
    name: "Demo User",
  }
}

export function isAuthenticated(): boolean {
  return true // Always authenticated for demo
}

// Export the demo user ID for direct use
export { DEMO_USER_ID }
