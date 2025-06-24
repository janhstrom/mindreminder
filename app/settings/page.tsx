"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const SettingsPage = () => {
  const { user, signOut, operationLoading, loading: pageLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && !pageLoading) {
      router.push("/login")
    }
  }, [user, router, pageLoading])

  if (pageLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // Or a message like "Redirecting..."
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Welcome, {user.email}!</p>

      <button
        onClick={handleSignOut}
        disabled={operationLoading}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-50"
      >
        {operationLoading ? "Logging out..." : "Log Out"}
      </button>
    </div>
  )
}

export default SettingsPage
