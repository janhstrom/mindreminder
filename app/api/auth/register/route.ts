import { type NextRequest, NextResponse } from "next/server"
import { SupabaseAuthService } from "@/lib/auth-supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const user = await SupabaseAuthService.getInstance().signUp(email, password, firstName, lastName)

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 400 })
  }
}
