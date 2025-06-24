import { type NextRequest, NextResponse } from "next/server"
import { SupabaseAuthService } from "@/lib/auth-supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    await SupabaseAuthService.getInstance().signIn(email, password)

    return NextResponse.json({ message: "Login successful" })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 401 })
  }
}
