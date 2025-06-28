import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: microActions, error } = await supabase
      .from("micro_actions")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching micro actions:", error)
      return NextResponse.json({ error: "Failed to fetch micro actions" }, { status: 500 })
    }

    return NextResponse.json({ microActions: microActions || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, duration, frequency, timeOfDay, habitStack, isActive } = body

    const { data: microAction, error } = await supabase
      .from("micro_actions")
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        category,
        duration,
        frequency,
        time_of_day: timeOfDay || null,
        habit_stack: habitStack || null,
        is_active: isActive !== undefined ? isActive : true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating micro action:", error)
      return NextResponse.json({ error: "Failed to create micro action" }, { status: 500 })
    }

    return NextResponse.json({ microAction })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
