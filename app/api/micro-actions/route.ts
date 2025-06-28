import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

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
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching micro actions:", error)
      return NextResponse.json({ error: "Failed to fetch micro actions" }, { status: 500 })
    }

    return NextResponse.json({ microActions })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, isCompleted = false } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const { data: microAction, error } = await supabase
      .from("micro_actions")
      .insert({
        user_id: user.id,
        title,
        description,
        category,
        is_completed: isCompleted,
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
